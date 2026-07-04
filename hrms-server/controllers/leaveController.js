const mongoose = require("mongoose");
const Leave = require("../models/Leave");
const Notification = require("../models/Notification");

// MOCK DATA
let mockLeaves = [
  { _id: "leave_1", user: { _id: "mock_emp_1", name: "Alice Johnson" }, leaveType: "sick", from: "2024-07-10", to: "2024-07-11", totalDays: 2, reason: "Fever", status: "approved" },
  { _id: "leave_2", user: { _id: "mock_emp_2", name: "Bob Smith" }, leaveType: "casual", from: "2024-07-15", to: "2024-07-15", totalDays: 1, reason: "Personal work", status: "pending" },
];

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private
exports.applyLeave = async (req, res) => {
  try {
    const { leaveType, from, to, reason } = req.body;
    
    const startDate = new Date(from);
    const endDate = new Date(to);
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

    if (mongoose.connection.readyState !== 1) {
      const leave = { _id: "mock_leave_" + Date.now(), user: req.user.id, leaveType, from, to, totalDays, reason, status: "pending", appliedOn: new Date() };
      mockLeaves.push(leave);
      return res.status(201).json({ success: true, leave });
    }

    const leave = await Leave.create({
      user: req.user.id,
      leaveType,
      from,
      to,
      totalDays,
      reason,
    });

    res.status(201).json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get my leave history
// @route   GET /api/leaves/my
// @access  Private
exports.getMyLeaves = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      const userLeaves = mockLeaves.filter(l => (l.user._id === req.user.id || l.user === req.user.id));
      return res.json({ success: true, leaves: userLeaves });
    }
    const leaves = await Leave.find({ user: req.user.id }).sort({ appliedOn: -1 });
    res.json({ success: true, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all leave requests (Admin/HR)
// @route   GET /api/leaves
// @access  Admin, HR
exports.getAllLeaves = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, count: mockLeaves.length, leaves: mockLeaves });
    }

    const leaves = await Leave.find().populate("user", "name employeeId department").sort({ appliedOn: -1 });
    res.json({ success: true, count: leaves.length, leaves });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id/status
// @access  Admin, HR
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status, comment } = req.body;
    let leave = await Leave.findById(req.params.id);

    if (!leave) return res.status(404).json({ success: false, message: "Leave request not found" });

    leave.status = status;
    leave.comment = comment;
    leave.approvedBy = req.user.id;

    await leave.save();

    // Create Notification for employee
    await Notification.create({
      user: leave.user,
      title: `Leave ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your leave request from ${new Date(leave.from).toDateString()} has been ${status}.`,
      type: "leave"
    });

    res.json({ success: true, leave });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
