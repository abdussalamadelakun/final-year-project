const User = require("../models/User");
const Facility = require("../models/Facility");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate({
        path: "facilityId",
        select: "name type location",
      })
      .select("-password"); // Don't send hashed passwords

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error fetching users." });
  }
};
