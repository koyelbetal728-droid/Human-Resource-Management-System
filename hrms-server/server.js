const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Route files
const auth = require("./routes/auth");
const users = require("./routes/users");
const attendance = require("./routes/attendance");
const leaves = require("./routes/leaves");
const payroll = require("./routes/payroll");

// Mount routers
app.use("/api/auth", auth);
app.use("/api/users", users);
app.use("/api/attendance", attendance);
app.use("/api/leaves", leaves);
app.use("/api/payroll", payroll);

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
