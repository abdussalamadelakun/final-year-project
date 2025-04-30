const mongoose = require("mongoose");

const medicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prescribedQuantity: { type: Number, required: true },
  dispensed: { type: Boolean, default: false },
  dispensedAt: { type: Date, default: null },
  prescribedBy: { type: String, required: true },
  dosage: {
    amount: { type: String, required: true },
    frequency: { type: String, required: true },
    instructions: { type: String, required: true }
  },
  refillable: { type: Boolean, default: false },
  refillsLeft: { type: Number, default: 0 },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  currentInfections: [String],
  currentMedications: [medicationSchema],
  patientId: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Patient", patientSchema);
