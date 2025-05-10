const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const protect = async(req, res, next) => {
    try {
        const token = req.headers.authorization ? req.headers.authorization.split(" ")[1] : null;
        if (!token) return res.status(401).json({ message: 'No token provided' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = { protect };