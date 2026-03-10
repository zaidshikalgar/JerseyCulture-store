const express = require('express');
const {
  register,
  requestSignupOtp,
  verifySignupOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  login,
  me,
  updateProfile,
  getAllUsers,
} = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/register/request-otp', requestSignupOtp);
router.post('/register/verify-otp', verifySignupOtp);
router.post('/forgot-password/request-otp', requestPasswordResetOtp);
router.post('/forgot-password/reset', resetPasswordWithOtp);
router.post('/login', login);
router.get('/me', protect, me);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
