const bcrypt = require('bcryptjs');
const User = require('../models/User');
const PendingSignup = require('../models/PendingSignup');
const PasswordReset = require('../models/PasswordReset');
const { generateToken } = require('../utils/token');
const { sendSignupOtpEmail, sendPasswordResetOtpEmail } = require('../utils/mailer');

const OTP_EXPIRY_MINUTES = 10;

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function publicUserPayload(user) {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    address: user.address || {},
    token: generateToken(user._id.toString()),
  };
}

const register = async (req, res, next) => {
  try {
    // Backward-compatible: register now starts OTP flow.
    return requestSignupOtp(req, res, next);
  } catch (error) {
    next(error);
  }
};

const requestSignupOtp = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email, and password are required' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const otp = generateOtp();
    const [passwordHash, otpHash] = await Promise.all([
      bcrypt.hash(password, 10),
      bcrypt.hash(otp, 10),
    ]);

    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await PendingSignup.findOneAndUpdate(
      { email: normalizedEmail },
      {
        name: String(name).trim(),
        email: normalizedEmail,
        passwordHash,
        otpHash,
        otpExpiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendSignupOtpEmail({
      toEmail: normalizedEmail,
      name: String(name).trim(),
      otp,
    });

    return res.json({
      message: 'OTP sent to your email',
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch (error) {
    next(error);
  }
};

const verifySignupOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'email and otp are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const pending = await PendingSignup.findOne({ email: normalizedEmail });
    if (!pending) {
      return res.status(400).json({ message: 'No pending signup found. Please request OTP again.' });
    }

    if (pending.otpExpiresAt.getTime() < Date.now()) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(400).json({ message: 'OTP expired. Please request a new OTP.' });
    }

    const isOtpValid = await bcrypt.compare(String(otp), pending.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await PendingSignup.deleteOne({ _id: pending._id });
      return res.status(409).json({ message: 'Email already in use' });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.passwordHash,
    });

    await PendingSignup.deleteOne({ _id: pending._id });

    return res.status(201).json(publicUserPayload(user));
  } catch (error) {
    next(error);
  }
};

const requestPasswordResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ message: 'No account found for this email' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await PasswordReset.findOneAndUpdate(
      { email: normalizedEmail },
      { email: normalizedEmail, otpHash, otpExpiresAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    await sendPasswordResetOtpEmail({
      toEmail: normalizedEmail,
      name: user.name || 'User',
      otp,
    });

    return res.json({
      message: 'Password reset OTP sent to your email',
      expiresInMinutes: OTP_EXPIRY_MINUTES,
    });
  } catch (error) {
    next(error);
  }
};

const resetPasswordWithOtp = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'email, otp and newPassword are required' });
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const reset = await PasswordReset.findOne({ email: normalizedEmail });
    if (!reset) {
      return res.status(400).json({ message: 'No password reset request found. Request OTP again.' });
    }

    if (reset.otpExpiresAt.getTime() < Date.now()) {
      await PasswordReset.deleteOne({ _id: reset._id });
      return res.status(400).json({ message: 'OTP expired. Request a new OTP.' });
    }

    const isOtpValid = await bcrypt.compare(String(otp), reset.otpHash);
    if (!isOtpValid) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      await PasswordReset.deleteOne({ _id: reset._id });
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    await PasswordReset.deleteOne({ _id: reset._id });

    return res.json({ message: 'Password reset successful. Please sign in.' });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json(publicUserPayload(user));
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  res.json(req.user);
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone, address } = req.body || {};

    if (typeof name === 'string') {
      user.name = name.trim() || user.name;
    }

    if (typeof phone === 'string') {
      user.phone = phone.trim();
    }

    if (address && typeof address === 'object') {
      user.address = {
        line1: String(address.line1 || '').trim(),
        line2: String(address.line2 || '').trim(),
        city: String(address.city || '').trim(),
        state: String(address.state || '').trim(),
        postalCode: String(address.postalCode || '').trim(),
        country: String(address.country || '').trim(),
      };
    }

    await user.save();

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone || '',
      address: user.address || {},
    });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 });
    return res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  requestSignupOtp,
  verifySignupOtp,
  requestPasswordResetOtp,
  resetPasswordWithOtp,
  login,
  me,
  updateProfile,
  getAllUsers,
};
