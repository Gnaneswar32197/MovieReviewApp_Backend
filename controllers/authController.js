const User = require('../models/User');
const Otp = require('../models/Otp');
const mailer = require('../utils/mailer');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Request password reset
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
        const otpEntry = new Otp({
            userId: user._id,
            otp,
            expiresAt: Date.now() + 3600000 // OTP valid for 1 hour
        });

        await otpEntry.save();
        await mailer.sendOtpEmail(email, otp); // Send OTP to user's email

        res.status(200).json({ success: true, message: 'OTP sent to your email' });
    } catch (error) {
        console.error('Error in requestPasswordReset:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Reset password
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const otpEntry = await Otp.findOne({ userId: user._id, otp });
        if (!otpEntry || otpEntry.expiresAt < Date.now()) {
            return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        await Otp.deleteOne({ _id: otpEntry._id }); // Remove OTP entry after use

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in resetPassword:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};