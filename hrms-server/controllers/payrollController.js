const mongoose = require("mongoose");
const Payroll = require("../models/Payroll");
const User = require("../models/User");

// MOCK DATA
let mockPayroll = [
  { _id: "pay_1", user: { _id: "mock_emp_1", name: "Alice Johnson" }, month: 6, year: 2024, basicSalary: 85000, netSalary: 78000, status: "paid" },
  { _id: "pay_2", user: { _id: "mock_emp_2", name: "Bob Smith" }, month: 6, year: 2024, basicSalary: 70000, netSalary: 64000, status: "pending" },
];

// @desc    Generate payroll for user
// @route   POST /api/payroll
// @access  Admin
exports.generatePayroll = async (req, res) => {
  try {
    const { userId, month, year, pf, tax, bonuses } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const pay = await Payroll.create({
      user: userId,
      month,
      year,
      basicSalary: user.salary,
      pf: pf || 0,
      tax: tax || 0,
      otherAllowances: bonuses || 0,
    });

    res.status(201).json({ success: true, payroll: pay });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: "Payroll already generated for this month" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get my salary slips
// @route   GET /api/payroll/my
// @access  Private
exports.getMyPayroll = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      // Add a mock payslip for the admin for current month
      const myMockPayroll = [
        { _id: "pay_admin_1", user: req.user.id, month: 6, year: 2024, basicSalary: 150000, netSalary: 138500, status: "paid" },
        { _id: "pay_admin_2", user: req.user.id, month: 5, year: 2024, basicSalary: 150000, netSalary: 138500, status: "paid" },
      ];
      return res.json({ success: true, payroll: myMockPayroll });
    }
    const payroll = await Payroll.find({ user: req.user.id }).sort({ year: -1, month: -1 });
    res.json({ success: true, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all payroll (Admin)
// @route   GET /api/payroll
// @access  Admin
exports.getAllPayroll = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockPayroll.length, payroll: mockPayroll });
    }

    const { month, year } = req.query;
    const query = {};
    if (month) query.month = month;
    if (year) query.year = year;

    const payroll = await Payroll.find(query).populate("user", "name employeeId department position");
    res.json({ success: true, count: payroll.length, payroll });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
