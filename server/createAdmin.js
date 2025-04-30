const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const seedAdmin = async () => {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(MONGO_URI);
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("❌ Admin already exists.");
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await User.create({
      username: "admin",
      email: "admin@system.com",
      password: hashedPassword,
      role: "admin",
      facilityId: null,
    });

    console.log("✅ Admin created successfully:");
    console.log(`Email: ${admin.email}`);
    console.log(`Password: admin123`);
    process.exit();
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
};

seedAdmin();
