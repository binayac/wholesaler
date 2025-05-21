const express = require('express');
const User = require('./user.model');
const generateToken = require('../middleware/generateToken');
const router = express.Router();
const transporter = require('../utils/nodemailerConfig')
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY;


//Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role, businessName, businessLicense, taxId } = req.body;

        // Username validation
        if (!username) {
            return res.status(400).send({ message: 'Username is required.' });
        }
        if (username.includes(' ')) {
            return res.status(400).send({ message: 'Username cannot contain spaces.' });
        }
        if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
            return res.status(400).send({ message: 'Username can only contain letters, numbers, underscores, or hyphens.' });
        }

        // Password validation
        if (!password) {
            return res.status(400).send({ message: 'Password is required.' });
        }
        if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(password)) {
            return res.status(400).send({
                message: 'Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character (!@#$%^&*).'
            });
        }

        // Check for duplicate username
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).send({ message: 'Username already in use.' });
        }

        // Check for duplicate email
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            if (!existingEmail.isEmailVerified) {
                // Resend verification email if user is unverified
                const verificationToken = await generateToken(existingEmail._id, 'verification');
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
                const mailOptions = {
                    from: process.env.GMAIL_USER,
                    to: email,
                    subject: 'Verify Your Email Address',
                    html: `
                        <h3>Welcome to Wholesale!</h3>
                        <p>Please verify your email by clicking the link below:</p>
                        <a href="${verificationLink}">Verify Email</a>
                        <p>This link will expire in 24 hours.</p>
                    `
                };

                await transporter.sendMail(mailOptions);
                return res.status(200).send({
                    message: 'Email already registered but not verified. A new verification email has been sent.'
                });
            }
            return res.status(400).send({ message: 'Email already in use.' });
        }

        // Validate role
        const validRoles = ['user', 'wholesaler', 'admin'];
        const userData = {
            username,
            email,
            password,
            role: validRoles.includes(role) ? role : 'user',
        };

        if (role === 'wholesaler') {
            userData.businessName = businessName;
            userData.businessLicense = businessLicense;
            userData.taxId = taxId;
            userData.isWholesalerApproved = false;
            userData.wholesalerStatus = 'pending';
        }

        const user = new User(userData);
        await user.save();

        // Generate verification token
        const verificationToken = await generateToken(user._id, 'verification');

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <h3>Welcome to Wholesale!</h3>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(201).send({ message: 'User registration successful! Please check your email to verify your account.' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Error registering user: ' + error.message });
    }
});

module.exports = router;

// verify email endpoint
router.get('/verify-email', async (req, res) => {
    try {
        const { token } = req.query;
        if (!token) {
            return res.status(400).send({ message: 'No verification token provided.' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        if (user.isEmailVerified) {
            return res.status(200).send({ message: 'Email already verified.' });
        }

        if (user.verificationToken !== token) {
            return res.status(400).send({ message: 'Invalid or expired token.' });
        }

        // Update user verification status
        user.isEmailVerified = true;
        user.verificationToken = null; // Clear token after verification
        await user.save();

        res.status(200).send({ message: 'Email verified successfully!' });
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(400).send({ message: 'Invalid or expired token.' });
    }
});

// resend verification
router.post('/resend-verification', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send({ message: 'User not found.' });
        }

        if (user.isEmailVerified) {
            return res.status(400).send({ message: 'Email already verified.' });
        }

        // Generate new verification token
        const verificationToken = await generateToken(user._id, 'verification');

        // Send verification email
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
                <h3>Welcome to Wholesale!</h3>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.status(200).send({ message: 'Verification email resent successfully.' });
    } catch (error) {
        console.error('Error resending verification email:', error);
        res.status(500).send({ message: 'Error resending verification email.' });
    }
});

// login user endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            return res.status(403).send({ message: 'Please verify your email before logging in.' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Password not match' });
        }

        // Wholesaler must be approved
        if (user.role === 'wholesaler' && user.wholesalerStatus !== 'approved') {
            return res.status(403).send({ message: 'Your account is pending approval. Please wait for admin approval.' });
        }

        const token = await generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        });

        res.status(200).send({
            message: 'Logged in successfully!',
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            },
        });
    } catch (error) {
        console.error('Error logged in user', error);
        res.status(500).send({ message: 'Error logged in user' });
    }
});


//logout endpoint
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({message: "Logged out successfully"})
})

//delete a user
router.delete('/users/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findByIdAndDelete(id);
        if(!user) {
            return res.status(404).send({message: "User not found"})
        }
        res.status(200).send({message: "User deleted successfully"})
    } catch (error) {
        console.error("Error deleting user", error);
        res.status(500).send({message: "Error deleting user"})
    }
})

//get all users
router.get('/users', async(req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({createdAt: -1});
        res.status(200).send(users)
    } catch (error) {
        console.error("Error fetchin users", error);
        res.status(500).send({message: "Error fetching users"})
    }
})

//update user role
router.put('/users/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {role} = req.body;
        const user = await User.findByIdAndUpdate(id, {role}, {new: true});
        if(!user) {
            return res.status(404).send({message: 'User not found'})
        }
        res.status(200).send({message: 'User role updated successfully', user})
    } catch (error) {
        console.error("Error updating user role", error);
        res.status(500).send({message: "Error updating user role"})
    }
})

//edit or update profile
router.patch('/edit-profile', async(req, res) => {
    try {
        const {userId, username, profileImage, bio, profession} = req.body;
        if(!userId){
            return res.status(400).send({message:'User ID is required'})
        }
        const user = await User.findById(userId);
        if(!user) {
            return res.status(400).send({message:'User not found'})
        }
        //update profile
        if(username !== undefined) user.username = username;
        if(profileImage !== undefined) user.profileImage = profileImage;
        if(bio !== undefined) user.bio = bio;
        if(profession !== undefined) user.profession = profession;
        await user.save();
        res.status(200).send({message: 'Profile updated successfully', 
        user: {
            _id: user._id,
            email:user.email,
            username: user.username,
            role: user.role,
            profileImage: user.profileImage,
            bio: user.bio,
            profession: user.profession
        }})
    } catch (error) {
        console.error("Error updating user profile", error);
        res.status(500).send({message: "Error updating user profile"})
    }
})

// GET pending wholesalers
router.get('/users/pending-wholesalers', async (req, res) => {
    try {
        const wholesalers = await User.find({ role: 'wholesaler' });
        res.status(200).json({ wholesalers });
    } catch (error) {
        console.error('Error fetching wholesalers', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT approve wholesaler
router.patch('/users/approve-wholesaler/:userId', async (req, res) => {
    try {
        const { status } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.params.userId, 
            { 
                wholesalerStatus: status,
                // Update the boolean for backward compatibility
                isWholesalerApproved: status === 'approved'
            },
            { new: true }
        );
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Error updating wholesaler status', error);
        res.status(500).json({ message: 'Server error' });
    }
}); 

module.exports = router;