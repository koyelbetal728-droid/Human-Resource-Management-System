const express = require("express");
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getDashboardStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin", "hr"), getAllUsers);
router.post("/", authorize("admin", "hr"), createUser);
router.get("/stats", authorize("admin", "hr"), getDashboardStats);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", authorize("admin"), deleteUser);

module.exports = router;
