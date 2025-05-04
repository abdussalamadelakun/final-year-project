const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require("../models/User");
const Facility = require("../models/Facility");
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

// GET /api/facility/staff/by-facility/:facilityId
router.get(
  "/staff/by-facility/:facilityId",
  authMiddleware,
  requireRole(["facilityAdmin", "admin"]),
  async (req, res) => {
    const { facilityId } = req.params;

    try {
      const staff = await User.find({
        facilityId,
        role: { $in: ["provider", "pharmacy"] },
      }).select("-password");

      res.status(200).json({ staff });
    } catch (err) {
      console.error("Error fetching staff by facility:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// GET /api/facility/:id - Get facility details by ID
router.get(
  "/:id",
  authMiddleware,
  requireRole(["facilityAdmin", "admin"]),
  async (req, res) => {
    try {
      const facility = await Facility.findById(req.params.id);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }

      res.json({ facility });
    } catch (err) {
      console.error("Error fetching facility:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
