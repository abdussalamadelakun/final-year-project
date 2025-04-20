const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  name: String,
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  currentInfections: [String],
  currentMedications: [String],
  patientId: String,
  dispensed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Patient", patientSchema);
