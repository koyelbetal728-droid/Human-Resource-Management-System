const express = require("express");
const {
  generatePayroll,
  getMyPayroll,
  getAllPayroll,
} = require("../controllers/payrollController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.post("/", authorize("admin"), generatePayroll);
router.get("/my", getMyPayroll);
router.get("/", authorize("admin"), getAllPayroll);

module.exports = router;
