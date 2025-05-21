const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'wholesaler', 'admin'],
        default: 'user' 
    },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    createdAt: { type: Date, default: Date.now },

    // Fields specific to wholesalers
    isWholesalerApproved: { type: Boolean, default: false },
    businessName: String,
    businessLicense: String,
    taxId: String,
    wholesalerStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending'
    },
    isEmailVerified: { type: Boolean, default: false },
    verificationToken: { type: String }, // New field for verification token
    totalSpent: { type: Number, default: 0 }  // Add the totalSpent field
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);
module.exports = User;
