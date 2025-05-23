const express = require('express');
const router = express.Router();
const {verifyOtp} = require('../Controllers/otpController');

router.post('/verify-otp',verifyOtp)

module.exports = router;