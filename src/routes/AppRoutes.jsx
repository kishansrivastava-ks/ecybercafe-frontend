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

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/apply/pan-card" element={<ApplyPanCard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="" element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="services" element={<UserServices />} />
            <Route path="services/pan-card" element={<ApplyPanCard />} />
            <Route path="services/rtps" element={<ApplyRtps />} />
            <Route path="services/job-card" element={<ApplyJobCard />} />
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
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
