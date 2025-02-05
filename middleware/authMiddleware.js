const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');

const verifyJWTToken = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};



// Middleware to verify JWT Token and Admin role
const verifyTokenAndAdmin = async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is an admin
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // If the request has an email parameter, respond with admin status of that user
        if (req.params.email) {
            const user = await User.findOne({ email: req.params.email });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isAdmin = user.role === 'Admin';
            return res.status(200).json({ Admin: isAdmin });
        }

        // Proceed to the next middleware or route handler if no email parameter
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

module.exports = { verifyJWTToken, verifyTokenAndAdmin };
