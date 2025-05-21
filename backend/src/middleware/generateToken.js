const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async (userId, type = 'auth') => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }
        const payload = { userId: user._id, role: user.role };
        const expiry = type === 'verification' ? '24h' : '1h';
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiry });
        
        if (type === 'verification') {
            user.verificationToken = token;
            await user.save();
        }
        
        return token;
    } catch (error) {
        throw new Error("Error generating token: " + error.message);
    }
};

module.exports = generateToken;