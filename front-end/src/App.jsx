import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import QRPage from "./QRPage";
import ProviderDashboard from "./HealthCareProvider/ProviderDashboard";
import ProviderPatientDetails from "./HealthCareProvider/ProviderPatientDetails";
import PharmacyDashboard from "./PharmacyDashboard";
import AdminDashboard from "./admin/AdminDashboard";
import CreateFacility from "./admin/CreateFacility";
import HospitalAdminDashboard from "./FacilityAdmin/HospitalAdminDashboard";
import RegisterStaff from "./FacilityAdmin/RegisterStaff";
import RegisterPatient from "./FacilityAdmin/RegisterPatient";
import PharmacyAdminDashboard from "./FacilityAdmin/PharmacyAdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/qr" element={<QRPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/provider" element={<ProviderDashboard />} />
      <Route
        path="/provider/patient/:id"
        element={<ProviderPatientDetails />}
      />
      <Route path="/pharmacy" element={<PharmacyDashboard />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/create-facility" element={<CreateFacility />} />
      <Route path="/hospital-admin" element={<HospitalAdminDashboard />} />
      <Route path="/facility/register-staff" element={<RegisterStaff />} />
      <Route path="/facility/register-patient" element={<RegisterPatient />} />
      <Route
        path="/facility/pharmacy-dashboard"
        element={<PharmacyAdminDashboard />}
      />
    </Routes>
  );
}

export default App;
