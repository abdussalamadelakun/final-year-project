const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Patient = require("./models/Patient");

dotenv.config();

const seedPatients = [
  {
    name: "John Doe",
    bloodType: "O+",
    allergies: ["Penicillin", "Dust"],
    chronicConditions: ["Sickle Cell Anaemia"],
    currentInfections: ["None"],
    patientId: "abc123",
    currentMedications: [
      {
        name: "Ibuprofen",
        prescribedQuantity: 30,
        dispensed: false,
        prescribedBy: "Dr. John Smith",
        dosage: {
          amount: "1 tablet",
          frequency: "twice daily",
          instructions: "after meals"
        },
        refillable: true,
        refillsLeft: 2
      },
      {
        name: "Paracetamol",
        prescribedQuantity: 15,
        dispensed: false,
        prescribedBy: "Dr. Zainab Yusuf",
        dosage: {
          amount: "2 tablets",
          frequency: "once daily",
          instructions: "before bedtime"
        },
        refillable: false,
        refillsLeft: 0
      }
    ]
  },
  {
    name: "Zainab Yusuf",
    bloodType: "A-",
    allergies: ["None"],
    chronicConditions: ["Sickle Cell Anaemia", "Asthma"],
    currentInfections: ["Malaria"],
    patientId: "xyz456",
    currentMedications: [
      {
        name: "Amoxicillin",
        prescribedQuantity: 20,
        dispensed: false,
        prescribedBy: "Dr. Michael Adeniyi",
        dosage: {
          amount: "1 capsule",
          frequency: "three times daily",
          instructions: "after meals"
        },
        refillable: true,
        refillsLeft: 1
      }
    ]
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await Patient.deleteMany({});
    await Patient.insertMany(seedPatients);
    console.log("Sample patients seeded ✅");
    process.exit();
  })
  .catch((err) => console.log(err));
