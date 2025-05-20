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
    instructions: { type: String, required: true },
  },
  refillable: { type: Boolean, default: false },
  refillsLeft: { type: Number, default: 0 },
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    required: true,
  },
  email: {
    type: String,
    match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
  },
  emergencyContact: { type: String },
  dateOfBirth: { type: Date },
  bloodType: String,
  allergies: [String],
  chronicConditions: [String],
  currentInfections: [String],
  currentMedications: [medicationSchema],
  patientId: { type: String, unique: true, required: true },
});

module.exports = mongoose.model("Patient", patientSchema);
