const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    const adminExists = await User.findOne({ email: "admin@nexhr.com" });
    if (adminExists) {
      console.log("Admin already exists.");
    } else {
      await User.create({
        name: "Super Admin",
        email: "admin@nexhr.com",
        password: "admin123", // Will be hashed by pre-save hook
        role: "admin",
        employeeId: "EMP0001",
        department: "Management",
        position: "CTO",
        salary: 150000,
      });
      console.log("Admin user seeded successfully!");
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
