const express = require('express');
const { requestPasswordReset } = require('../controllers/authController');

const router = express.Router();

// Route for requesting a password reset
router.post('/forgot-password', requestPasswordReset);

module.exports = router;