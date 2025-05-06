const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Facility = require("../models/Facility");
const User = require("../models/User");
const Patient = require("../models/Patient");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get("/facilities", async (req, res) => {
  try {
    const facilities = await Facility.find()
      .populate("adminUser", "username email")
      .sort({ createdAt: -1 });

    res.json(facilities);
  } catch (err) {
    console.error("Error fetching facilities:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/facilities/register", async (req, res) => {
  const { name, type, location, admin } = req.body;

  if (!name || !type || !admin?.email || !admin?.password || !admin?.username) {
    return res
      .status(400)
      .json({ message: "Facility and admin info are required" });
  }

  try {
    // Check if email already exists
    const existing = await User.findOne({ email: admin.email });
    if (existing) {
      return res.status(400).json({ message: "Admin email already in use" });
    }

    // Step 1: Create the admin user (without facilityId yet)
    const hashedPassword = await bcrypt.hash(admin.password, 10);
    const newAdmin = new User({
      username: admin.username,
      email: admin.email,
      password: hashedPassword,
      role: "facilityAdmin",
    });
    await newAdmin.save();

    // Step 2: Create the facility with adminUser
    const facility = new Facility({
      name,
      type,
      location,
      adminUser: newAdmin._id,
    });
    await facility.save();

    // Step 3: Update the admin user with facilityId
    newAdmin.facilityId = facility._id;
    await newAdmin.save();

    res.status(201).json({
      facility,
      admin: {
        id: newAdmin._id,
        email: newAdmin.email,
        username: newAdmin.username,
      },
    });
  } catch (err) {
    console.error("Error registering facility:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete(
  "/facility/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const facilityId = req.params.id;

      const facility = await Facility.findByIdAndDelete(facilityId);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found" });
      }

      // Delete associated facility admin
      if (facility.adminUser) {
        await User.findByIdAndDelete(facility.adminUser);
      }

      // Delete all staff (providers/pharmacy) linked to this facility
      await User.deleteMany({
        facilityId: facilityId,
        role: { $in: ["provider", "pharmacy"] },
      });

      res
        .status(200)
        .json({ message: "Facility and associated users deleted" });
    } catch (err) {
      console.error("Error deleting facility and staff:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Only admins can fetch users
router.get(
  "/users",
  authMiddleware,
  requireRole(["admin"]),
  adminController.getAllUsers
);

// GET all patients (admin only)
router.get(
  "/patients",
  authMiddleware,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const patients = await Patient.find(); // or add pagination/sorting later
      res.json(patients);
    } catch (err) {
      console.error("Error fetching patients:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// DELETE a patient (admin only)
router.delete(
  "/patients/:id",
  authMiddleware,
  requireRole(["admin"]),
  async (req, res) => {
    try {
      const deleted = await Patient.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json({ message: "Patient deleted successfully" });
    } catch (err) {
      console.error("Error deleting patient:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
