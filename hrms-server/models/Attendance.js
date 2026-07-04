const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    checkIn: { type: String, default: null }, // "HH:MM AM/PM"
    checkOut: { type: String, default: null },
    status: {
      type: String,
      enum: ["present", "absent", "half-day", "leave", "holiday"],
      default: "present",
    },
    workHours: { type: Number, default: 0 }, // in minutes
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

// Compound unique index: one record per user per day
attendanceSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
