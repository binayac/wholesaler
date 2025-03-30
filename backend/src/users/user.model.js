const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'wholesaler', 'admin'], // Added wholesaler role
        default: 'user' 
    },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    createdAt: { type: Date, default: Date.now },
    
    // Fields specific to wholesalers
    isWholesalerApproved: { type: Boolean, default: false }, // Approval flag
    businessName: String,  // Business details
    businessLicense: String, // Could store license number or file path
    taxId: String, // Taxpayer identification number for wholesalers
});

// Hashing passwords
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password comparison method
userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = model('User', userSchema);
module.exports = User;
