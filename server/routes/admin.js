const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Facility = require("../models/Facility");
const User = require("../models/User");

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
  
module.exports = router;
