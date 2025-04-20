const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// GET /api/patients?search=term
router.get("/", async (req, res) => {
  const search = req.query.search || "";
  const regex = new RegExp(search, "i"); // case-insensitive

  try {
    const patients = await Patient.find({
      $or: [{ name: regex }, { patientId: regex }],
    });

    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/patients/:id
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/patients/:id
router.put("/:id", async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      req.body,
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get basic public data
router.get("/:id/public", async (req, res) => {
  try {
    const patient = await Patient.findOne({ patientId: req.params.id });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const publicData = {
      name: patient.name,
      patientId: patient.patientId,
      bloodType: patient.bloodType,
      allergies: patient.allergies,
      chronicConditions: patient.chronicConditions,
    };

    res.json(publicData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/patients/:id/dispense
router.put("/:id/dispense", async (req, res) => {
  try {
    const patient = await Patient.findOneAndUpdate(
      { patientId: req.params.id },
      { dispensed: true },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
