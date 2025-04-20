import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import QRPage from "./QRPage";
import ProviderDashboard from "./HealthCareProvider/ProviderDashboard";
import ProviderPatientDetails from "./HealthCareProvider/ProviderPatientDetails";
import PharmacyDashboard from "./PharmacyDashboard";

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
    </Routes>
  );
}

export default App;
