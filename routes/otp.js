const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');

const router = express.Router();

// Route to send OTP to user's email
router.post('/send', sendOtp);

// Route to verify the OTP
router.post('/verify', verifyOtp);

module.exports = router;