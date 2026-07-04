const mongoose = require("mongoose");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT token
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Generate employee ID
    const count = await User.countDocuments();
    const employeeId = `EMP${String(count + 1).padStart(4, "0")}`;

    const user = await User.create({ name, email, password, role: role || "employee", employeeId });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role, employeeId: user.employeeId },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }

    // MOCK LOGIN for Demo Mode (if Mongo is not connected)
    if (mongoose.connection.readyState !== 1) {
      if (email === "admin@nexhr.com" && password === "admin123") {
        const mockUser = {
          id: "mock_admin_123",
          name: "Demo Admin (Offline Mode)",
          email: "admin@nexhr.com",
          role: "admin",
          department: "Management",
          position: "CTO",
          employeeId: "EMP0001"
        };
        const token = jwt.sign({ id: mockUser.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ success: true, token, user: mockUser, mode: 'demo' });
      }
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, avatar: user.avatar, employeeId: user.employeeId,
        department: user.department, position: user.position,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    if (req.user?.id === "mock_admin_123") {
      return res.json({
        success: true,
        user: {
          id: "mock_admin_123",
          name: "Demo Admin (Offline Mode)",
          email: "admin@nexhr.com",
          role: "admin",
          department: "Management",
          position: "CTO",
          employeeId: "EMP0001"
        }
      });
    }
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update password
// @route   PUT /api/auth/update-password
// @access  Private
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select("+password");
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ success: false, message: "Current password is incorrect" });
    }
    user.password = newPassword;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Forgot password (generate token)
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: "No user with that email" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save({ validateBeforeSave: false });

    // In production you'd email the token. For now return it.
    res.json({ success: true, message: "Password reset token generated", resetToken });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: "Invalid or expired token" });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.json({ success: true, token, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
