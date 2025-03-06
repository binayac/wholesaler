const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        if(!user) {
            throw new Error("User not found.");
        }
        const token = jwt.sign({userID: user._id, role: user.role}, JWT_SECRET, {expiresIn: "1h"});
        return token
    } catch {}
}

module.exports = generateToken;