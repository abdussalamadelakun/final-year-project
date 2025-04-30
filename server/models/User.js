const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },  // keep 'username'
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  role: {
    type: String,
    enum: ["admin", "facilityAdmin", "provider", "pharmacy"], // one unified admin role
    required: true,
  },
  facilityId: { type: mongoose.Schema.Types.ObjectId, ref: "Facility" }, // null for global admin
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
