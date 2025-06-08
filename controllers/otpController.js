const Otp = require('../models/Otp');
const User = require('../models/User');
const mailer = require('../utils/mailer');
const crypto = require('crypto');

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
};

const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = generateOtp();
    const otpEntry = new Otp({
      userId: user._id,
      otp,
      expiresAt: Date.now() + 3600000 // OTP valid for 1 hour
    });

    await otpEntry.save();
    await mailer.sendMail({
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 1 hour.`
    });

    res.status(200).json({ success: true, message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otpEntry = await Otp.findOne({ userId: user._id, otp });
    if (!otpEntry) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (otpEntry.expiresAt < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP has expired' });
    }

    await Otp.deleteOne({ _id: otpEntry._id }); // Remove OTP after verification
    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};

module.exports = {
  sendOtp,
  verifyOtp
};