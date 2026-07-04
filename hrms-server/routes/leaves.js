const express = require("express");
const {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} = require("../controllers/leaveController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", applyLeave);
router.get("/my", getMyLeaves);
router.get("/", authorize("admin", "hr"), getAllLeaves);
router.put("/:id/status", authorize("admin", "hr"), updateLeaveStatus);

module.exports = router;
