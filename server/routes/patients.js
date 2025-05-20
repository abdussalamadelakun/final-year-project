const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");
const Facility = require("../models/Facility");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const generatePatientId = require("../utils/generatePatientId");

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

router.post(
  "/register",
  authMiddleware,
  requireRole(["facilityAdmin"]),
  async (req, res) => {
    const {
      name,
      gender,
      bloodType,
      allergies,
      chronicConditions,
      currentInfections,
      email,
      emergencyContact,
      dateOfBirth,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const facility = await Facility.findById(req.user.facilityId);
    if (!facility || facility.type !== "hospital") {
      return res
        .status(403)
        .json({ message: "Only hospital admins can register patients" });
    }

    try {
      let patientId;
      let existing;

      // Ensure uniqueness
      do {
        patientId = generatePatientId();
        existing = await Patient.findOne({ patientId });
      } while (existing);

      const patient = new Patient({
        name,
        gender,
        email,
        emergencyContact,
        dateOfBirth,
        bloodType,
        allergies,
        chronicConditions,
        currentInfections,
        patientId,
      });

      await patient.save();

      res.status(201).json({
        message: "Patient registered successfully",
        patient,
      });
    } catch (err) {
      console.error("Error registering patient:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

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
      gender: patient.gender,
      email: patient.email,
      emergencyContact: patient.emergencyContact,
      dateOfBirth: patient.dateOfBirth
        ? patient.dateOfBirth.toISOString().split("T")[0]
        : null,
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

// PUT /api/patients/:id/medications/:medName/dispense
router.put("/:id/medications/:medName/dispense", async (req, res) => {
  const { id, medName } = req.params;

  try {
    const patient = await Patient.findOne({ patientId: id });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const medication = patient.currentMedications.find(
      (med) => med?.name?.toLowerCase() === medName.toLowerCase()
    );

    if (!medication) {
      return res.status(404).json({ message: "Medication not found" });
    }

    if (medication.dispensed && medication.refillsLeft <= 0) {
      return res
        .status(400)
        .json({ message: "No refills left for this medication" });
    }

    // Full dispensing
    medication.dispensed = true;
    medication.dispensedAt = new Date();

    if (medication.refillable && medication.refillsLeft > 0) {
      medication.refillsLeft -= 1;
      // If no more refills left, lock the med
      if (medication.refillsLeft === 0) {
        medication.refillable = false;
      }
    }

    await patient.save();

    res.json({ message: "Medication dispensed successfully", medication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
