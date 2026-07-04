const mongoose = require("mongoose");
const Attendance = require("../models/Attendance");
const User = require("../models/User");

// MOCK DATA
let mockAttendance = [
  { _id: "att_1", user: "mock_admin_123", date: new Date().toISOString().split("T")[0], checkIn: "09:00 AM", checkOut: "06:00 PM", status: "present", workHours: 540 },
  { _id: "att_2", user: "mock_emp_1", date: new Date().toISOString().split("T")[0], checkIn: "09:15 AM", checkOut: null, status: "present", workHours: 0 },
];

// @desc    Check-in
// @route   POST /api/attendance/check-in
// @access  Private
exports.checkIn = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (mongoose.connection.readyState !== 1) {
      const today = new Date().toISOString().split("T")[0];
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      const record = { _id: "mock_att_" + Date.now(), user: req.user.id, date: today, checkIn: time, status: "present" };
      mockAttendance.push(record);
      return res.status(201).json({ success: true, attendance: record });
    }

    let attendance = await Attendance.findOne({ user: req.user.id, date: today });
    if (attendance) {
      return res.status(400).json({ success: false, message: "Already checked in today" });
    }

    attendance = await Attendance.create({
      user: req.user.id,
      date: today,
      checkIn: time,
      status: "present",
    });

    res.status(201).json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Check-out
// @route   PUT /api/attendance/check-out
// @access  Private
exports.checkOut = async (req, res) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    if (mongoose.connection.readyState !== 1) {
      let record = mockAttendance.find(a => a.user === req.user.id && a.date === today);
      if (!record) return res.status(404).json({ success: false, message: "No check-in record found for today (Demo Mode)" });
      if (record.checkOut) return res.status(400).json({ success: false, message: "Already checked out today (Demo Mode)" });
      
      record.checkOut = time;
      record.status = "present";
      return res.json({ success: true, attendance: record });
    }

    let attendance = await Attendance.findOne({ user: req.user.id, date: today });
    if (!attendance) {
      return res.status(404).json({ success: false, message: "No check-in record found for today" });
    }
    if (attendance.checkOut) {
      return res.status(400).json({ success: false, message: "Already checked out today" });
    }

    attendance.checkOut = time;
    // Simple duration calculation (in minutes)
    const [inH, inM] = attendance.checkIn.split(/:| /);
    const [outH, outM] = time.split(/:| /);
    let start = parseInt(inH) * 60 + parseInt(inM);
    let end = parseInt(outH) * 60 + parseInt(outM);
    attendance.workHours = end - start;

    await attendance.save();
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get user's attendance history
// @route   GET /api/attendance/my
// @access  Private
exports.getMyAttendance = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, attendance: mockAttendance.filter(a => a.user === req.user.id) });
    }

    const attendance = await Attendance.find({ user: req.user.id }).sort({ date: -1 });
    res.json({ success: true, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get all attendance (Admin/HR)
// @route   GET /api/attendance
// @access  Admin, HR
exports.getAllAttendance = async (req, res) => {
  try {
    const { date, department } = req.query;
    const query = {};
    if (date) query.date = date;

    let attendance = await Attendance.find(query).populate("user", "name employeeId department");

    if (department) {
      attendance = attendance.filter(a => a.user.department === department);
    }

    res.json({ success: true, count: attendance.length, attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
