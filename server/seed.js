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
    currentMedications: ["Hydroxyurea"],
    patientId: "abc123",
  },
  {
    name: "Zainab Yusuf",
    bloodType: "A-",
    allergies: ["None"],
    chronicConditions: ["Sickle Cell Anaemia", "Asthma"],
    currentInfections: ["Malaria"],
    currentMedications: ["Ibuprofen", "Folic Acid"],
    patientId: "xyz456",
  },
];

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ssl: true, // <-- add this explicitly
    tlsAllowInvalidCertificates: true, // <- ONLY if testing locally, remove in production
  })
  .then(async () => {
    await Patient.deleteMany({});
    await Patient.insertMany(seedPatients);
    console.log("Sample patients seeded ✅");
    process.exit();
  })
  .catch((err) => console.log(err));
