const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

const User = require("../models/User");

const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; 


router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body:", req.body);


  try {
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
        { userId: user._id, role: user.role, facilityId: user.facilityId || null },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

   
    const { password: pw, ...userWithoutPassword } = user;

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
