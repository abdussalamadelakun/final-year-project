const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// POST /api/facility/staff/register
router.post(
    "/staff/register",
    authMiddleware,
    requireRole(["facilityAdmin"]),
    async (req, res) => {
      const { email, password, username, role } = req.body;
      const facilityId = req.user.facilityId;
  
      if (!email || !password || !username || !role) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      if (!["provider", "pharmacy"].includes(role)) {
        return res.status(400).json({ message: "Invalid staff role" });
      }
  
      try {
        const existing = await User.findOne({ email });
        if (existing) {
          return res.status(400).json({ message: "Email already in use" });
        }
  
        const hashedPassword = await bcrypt.hash(password, 10);
  
        const newStaff = new User({
          username,
          email,
          password: hashedPassword,
          role,
          facilityId,
        });
  
        await newStaff.save();
  
        res.status(201).json({
          message: "Staff registered successfully",
          staff: {
            id: newStaff._id,
            username: newStaff.username,
            email: newStaff.email,
            role: newStaff.role,
            facilityId: newStaff.facilityId,
          },
        });
      } catch (err) {
        console.error("Error registering staff:", err);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
  

module.exports = router;
