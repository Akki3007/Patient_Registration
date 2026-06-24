import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import PersonalInfo from "../pages/PersonalInfo/PersonalInfo";
import AdditionalInfo from "../pages/AdditionalInfo/AdditionalInfo";
import MedicalHistory from "../pages/MedicalHistory/MedicalHistory";
import Insurance from "../pages/Insurance/Insurance";
import HealthRecords from "../pages/HealthRecords/HealthRecords";
import Review from "../pages/Review/Review";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<PersonalInfo />} />
          <Route path="/additional-info" element={<AdditionalInfo />} />
          <Route path="/medical-history" element={<MedicalHistory />} />
          <Route path="/insurance" element={<Insurance />} />
          <Route path="/health-records" element={<HealthRecords />} />
          <Route path="/review" element={<Review />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
