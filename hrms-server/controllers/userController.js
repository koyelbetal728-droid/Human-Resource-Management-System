const mongoose = require("mongoose");
const User = require("../models/User");

// MOCK DATA for Demo Mode
let mockUsers = [
  { _id: "mock_admin_123", name: "Demo Admin", email: "admin@nexhr.com", role: "admin", department: "Management", position: "CTO", employeeId: "EMP0001", isActive: true, salary: 150000 },
  { _id: "mock_emp_1", name: "Alice Johnson", email: "alice@nexhr.com", role: "employee", department: "Engineering", position: "Senior Dev", employeeId: "EMP0002", isActive: true, salary: 85000 },
  { _id: "mock_emp_2", name: "Bob Smith", email: "bob@nexhr.com", role: "employee", department: "Sales", position: "Manager", employeeId: "EMP0003", isActive: true, salary: 70000 },
  { _id: "mock_hr_1", name: "Sarah HR", email: "hr@nexhr.com", role: "hr", department: "HR", position: "HR Manager", employeeId: "EMP0004", isActive: true, salary: 65000 },
];

// @desc    Get all employees
// @route   GET /api/users
// @access  Admin, HR
exports.getAllUsers = async (req, res) => {
  try {
    const { role, department, search, page = 1, limit = 20 } = req.query;
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockUsers.length, total: mockUsers.length, users: mockUsers });
    }

    const query = {};
    if (role) query.role = role;
    if (department) query.department = department;
    if (search) query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { employeeId: { $regex: search, $options: "i" } },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json({ success: true, count: users.length, total, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin, HR, Own employee
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create employee (Admin/HR only)
// @route   POST /api/users
// @access  Admin, HR
exports.createUser = async (req, res) => {
  try {
    const count = await User.countDocuments();
    const employeeId = `EMP${String(count + 1).padStart(4, "0")}`;
    const user = await User.create({ ...req.body, employeeId });
    res.status(201).json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Admin, HR, Own employee (limited fields)
exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ["name", "phone", "address", "avatar", "department", "position", "salary", "isActive"];
    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    // Only admin can change role/salary/isActive
    if (req.user.role !== "admin") {
      delete updates.salary;
      delete updates.isActive;
    }

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    res.json({ success: true, message: "Employee deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Dashboard stats (Admin)
// @route   GET /api/users/stats
// @access  Admin, HR
exports.getDashboardStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        success: true,
        totalEmployees: 3,
        activeEmployees: 3,
        departments: [
          { _id: "Engineering", count: 1 },
          { _id: "Sales", count: 1 },
          { _id: "HR", count: 1 }
        ]
      });
    }

    const totalEmployees = await User.countDocuments({ role: "employee" });
    const activeEmployees = await User.countDocuments({ role: "employee", isActive: true });
    const departments = await User.aggregate([
      { $match: { role: "employee" } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, totalEmployees, activeEmployees, departments });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
