const express = require("express");
const {
  checkIn,
  checkOut,
  getMyAttendance,
  getAllAttendance,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/check-in", checkIn);
router.put("/check-out", checkOut);
router.get("/my", getMyAttendance);
router.get("/", authorize("admin", "hr"), getAllAttendance);

module.exports = router;
