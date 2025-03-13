const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userSchema');
const rateLimit = require('express-rate-limit');

// Rate Limiter Middleware
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: { message: 'Too many login attempts from this IP, please try again after 15 minutes' },
});


const loginUser = async (req, res) => {
    const { email, password, deviceInfo } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email }).exec();

        if (!user) {
            return res.status(401).json({ message: 'Incorrect username or password.' });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Incorrect password.' });
        }

        // Extract current devices
        const currentDevices = user.deviceInfo || [];

        // Check if there's already a device registered for this OS
        const existingDevice = currentDevices.find(dev => dev.osType === deviceInfo.osType);

        // If a different device (new deviceId) is detected for the same OS & different browser, block login
        if (existingDevice && existingDevice.deviceId !== deviceInfo.deviceId) {
            // Allow login only if it's the same OS **and** same browser
            if (existingDevice.browser !== deviceInfo.browser) {
                return res.status(401).json({ message: 'You cannot log in from a new device on this OS. Use your registered device.' });
            }
        }

        // Add or update device info (replace existing OS entry)
        const updatedDeviceInfo = [
            ...currentDevices.filter(dev => dev.osType !== deviceInfo.osType || dev.browser !== deviceInfo.browser),
            deviceInfo // Add the new/updated device for this OS and browser
        ];

        // Update user document with new device info
        await User.findByIdAndUpdate(user._id, { deviceInfo: updatedDeviceInfo }, { new: true });

        // Create token payload
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role
        };

        // Sign token with expiration (1 day)
        const token = jwt.sign(tokenPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        // Respond with success message and token
        res.status(200).json({
            message: 'Login successful',
            email: user.email,
            token: token
        });
    } catch (error) {
        console.error('Server error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).exec();

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            _id: user._id,
            displayName: user.displayName,
            email: user.email,
            role: user.role,
            firebaseUid: user.firebaseUid,
            disabled: user.disabled,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = {
    loginUser,
    getUserProfile,
    loginLimiter,
};
