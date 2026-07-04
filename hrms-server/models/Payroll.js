const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    month: { type: Number, required: true }, // 1–12
    year: { type: Number, required: true },
    basicSalary: { type: Number, required: true },
    hra: { type: Number, default: 0 },
    medicalAllowance: { type: Number, default: 0 },
    travelAllowance: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },
    pf: { type: Number, default: 0 },           // Provident Fund deduction
    tax: { type: Number, default: 0 },           // Tax deduction
    otherDeductions: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    paidOn: { type: Date },
    status: { type: String, enum: ["pending", "paid"], default: "pending" },
    presentDays: { type: Number, default: 0 },
    leaveDays: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Unique payroll per employee per month/year
payrollSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

// Calculate net salary before save
payrollSchema.pre("save", function (next) {
  this.grossSalary =
    this.basicSalary + this.hra + this.medicalAllowance +
    this.travelAllowance + this.otherAllowances;
  this.netSalary =
    this.grossSalary - this.pf - this.tax - this.otherDeductions;
  next();
});

module.exports = mongoose.model("Payroll", payrollSchema);
