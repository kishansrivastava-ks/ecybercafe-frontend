import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
// import Dashboard from "../pages/Dashboard";
import AppLayout from "../layouts/AppLayout";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyEmail from "../pages/VerifyEmail";
import DashboardLayout from "../layouts/DashboardLayout";
import UserProfile from "../pages/Dashboard/UserProfile";
import UserServices from "../pages/Dashboard/UserServices";
import Services from "../pages/Services";
import ApplyPanCard from "../pages/Services/ApplyPanCard";
import AdminDashboardLayout from "../layouts/AdminDashboardLayout";
import AdminServices from "../pages/AdminDashboard/AdminServices";
import AdminServiceDetails from "../pages/AdminDashboard/AdminServiceDetails";
import Home from "../pages/Home";
import ServiceDetailsPan from "../pages/Dashboard/ServiceDetailsPan";
import ProtectedRoute from "../components/ProtectedRouteComponent";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import ApplyRtps from "../pages/Services/ApplyRtps";
import ApplyJobCard from "../pages/Services/ApplyJobCard";
import ServiceDetailsRtps from "../pages/Dashboard/ServiceDetailsRtps";
import ServiceDetailsJobCard from "../pages/Dashboard/ServiceDetailsJobCard";
import ASDPan from "../pages/AdminDashboard/ASDPan";
import ASDRtps from "../pages/AdminDashboard/ASDRtps";
import ASDJobCard from "../pages/AdminDashboard/ASDJobCard";
import About from "../pages/About";
import Contact from "../pages/Contact";

import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";
import Terms from "../pages/Legal/Terms";
import CookiesPolicy from "../pages/Legal/CookiesPolicy";
import Refunds from "../pages/Legal/Refunds";
import ServicesByType from "../pages/AdminDashboard/ServicesByType";
import ServicesPan from "../pages/AdminDashboard/ServicesPan";
import ServicesJobCard from "../pages/AdminDashboard/ServicesJobCard";
import ServicesRtps from "../pages/AdminDashboard/ServicesRtps";
import DocumentUpload from "../test/DocumentUpload";
import DocumentTester from "../test/DocumentTester";
import AadharCard from "../pages/Products/AadharCard";
import VoterCard from "../pages/Products/VoterID";
import EShareCard from "../pages/Products/EShareCard";
import AyushmanCard from "../pages/Products/AyushmanCard";
import PanCard from "../pages/Products/PanCard";
import PanCardPVC from "../pages/Products/PanCardPVC";
import A4Paper from "../pages/Products/A4Paper ";
import PhotoPaper from "../pages/Products/PhotoPaper";
import LaminatePouch from "../pages/Products/LaminatePouch";
import LaminatedAadhar from "../pages/Products/LaminatedAadhar";
import PanCardServices from "../pages/Dashboard/Lists/PanCardServices";
import RTPSServices from "../pages/Dashboard/Lists/RTPSServices";
import JobCardServices from "../pages/Dashboard/Lists/JobCardServices";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route path="/services">
            <Route path="" element={<Services />} />
            <Route path="aadhar-card" element={<AadharCard />} />
            <Route path="voter-id" element={<VoterCard />} />
            <Route path="eshare-card" element={<EShareCard />} />
            <Route path="ayushman-card" element={<AyushmanCard />} />

            <Route path="pan-card" element={<PanCard />} />

            <Route path="pan-card-pvc" element={<PanCardPVC />} />
            <Route path="a4-paper" element={<A4Paper />} />
            <Route path="photo-paper" element={<PhotoPaper />} />
            <Route path="laminated-pouch" element={<LaminatePouch />} />
            <Route path="laminated-aadhar" element={<LaminatedAadhar />} />
          </Route>

          <Route path="/apply/pan-card" element={<ApplyPanCard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/document-tester" element={<DocumentTester />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/cookies" element={<CookiesPolicy />} />
          <Route path="/refunds" element={<Refunds />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="" element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="services" element={<UserServices />} />

            <Route path="services/pan-card" element={<ApplyPanCard />} />
            <Route
              path="services/pan-card/list"
              element={<PanCardServices />}
            />

            <Route path="services/rtps" element={<ApplyRtps />} />
            <Route path="services/rtps/list" element={<RTPSServices />} />

            <Route path="services/job-card" element={<ApplyJobCard />} />
            <Route
              path="services/job-card/list"
              element={<JobCardServices />}
            />

            <Route
              path="services/pan/:serviceId"
              element={<ServiceDetailsPan />}
            />
            <Route
              path="services/rtps/:serviceId"
              element={<ServiceDetailsRtps />}
            />
            <Route
              path="services/job-card/:serviceId"
              element={<ServiceDetailsJobCard />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
            <Route index element={<AdminServices />} />
            {/* <Route path="service/:id" element={<AdminServiceDetails />} /> */}
            <Route path="service/pan/:id" element={<ASDPan />} />
            <Route path="service/rtps/:id" element={<ASDRtps />} />
            <Route path="service/job-card/:id" element={<ASDJobCard />} />
            <Route path="services" element={<ServicesByType />} />
            <Route path="services/pan" element={<ServicesPan />} />
            <Route path="services/job-card" element={<ServicesJobCard />} />
            <Route path="services/rtps" element={<ServicesRtps />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
