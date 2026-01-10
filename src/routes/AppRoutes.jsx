import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Home from "../pages/Home";
import ServiceDetailsPan from "../pages/Dashboard/ServiceDetailsPan";
import ProtectedRoute from "../components/ProtectedRouteComponent";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import ServiceDetailsRtps from "../pages/Dashboard/ServiceDetailsRtps";
import ServiceDetailsJobCard from "../pages/Dashboard/ServiceDetailsJobCard";
import ASDPan from "../pages/AdminDashboard/ASDPan";
import ASDRtps from "../pages/AdminDashboard/ASDRtps";
import ASDJobCard from "../pages/AdminDashboard/ASDJobCard";

import ServicesByType from "../pages/AdminDashboard/ServicesByType";
import ServicesPan from "../pages/AdminDashboard/ServicesPan";
import ServicesJobCard from "../pages/AdminDashboard/ServicesJobCard";
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
import ASDITR from "../pages/AdminDashboard/ASDITR";
import ApplyITR from "../pages/Services/ApplyITR";
import ServiceDetailsITR from "../pages/Dashboard/ServiceDetailsITR";
import Users from "../pages/AdminDashboard/Users";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";

import Wallet from "../pages/Dashboard/WalletPages/Wallet";
import PaymentStatus from "../pages/Dashboard/WalletPages/PaymentStatus";
import AdminWalletDashboard from "../pages/AdminDashboard/AdminWalletDashboard";
import ApplyVoterCard from "../pages/Dashboard/Applications/ApplyVoterCard";
import VoterCardList from "../pages/Dashboard/Lists/VoterCardList";
import AdminVoterServices from "../pages/AdminDashboard/AdminVoterServices";
import ApplyRtps from "../pages/Dashboard/Applications/ApplyRtps";
import AdminRtpsServices from "../pages/AdminDashboard/AdminRtpsServices";
import RtpsList from "../pages/Dashboard/Lists/RtpsList";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

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
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["user"]} />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route path="" element={<UserProfile />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="services" element={<UserServices />} />

            <Route path="wallet" element={<Wallet />} />
            <Route path="wallet/status/:orderId" element={<PaymentStatus />} />

            <Route path="services/pan-card" element={<ApplyPanCard />} />
            <Route
              path="services/pan-card/list"
              element={<PanCardServices />}
            />

            <Route path="services/rtps" element={<ApplyRtps />} />
            <Route path="services/rtps/list" element={<RtpsList />} />

            <Route path="services/voter-card" element={<ApplyVoterCard />} />
            <Route
              path="services/voter-card/list"
              element={<VoterCardList />}
            />

            <Route path="services/itr" element={<ApplyITR />} />

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
            <Route
              path="services/itr/:serviceId"
              element={<ServiceDetailsITR />}
            />
          </Route>
        </Route>

        {/* <Route path="/payment-status" element={<PaymentStatus />} /> */}

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin-dashboard" element={<AdminDashboardLayout />}>
            {/* <Route index element={<AdminServices />} /> */}
            <Route path="services" element={<ServicesByType />} />
            <Route path="service/pan/:id" element={<ASDPan />} />
            <Route path="service/rtps/:id" element={<ASDRtps />} />
            <Route path="service/job-card/:id" element={<ASDJobCard />} />
            <Route path="service/itr/:id" element={<ASDITR />} />
            <Route path="services/pan" element={<ServicesPan />} />
            <Route path="services/job-card" element={<ServicesJobCard />} />
            <Route path="services/rtps" element={<AdminRtpsServices />} />
            <Route
              path="services/voter-card"
              element={<AdminVoterServices />}
            />
            <Route path="users" element={<Users />} />

            <Route path="wallet-status" element={<AdminWalletDashboard />} />
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
