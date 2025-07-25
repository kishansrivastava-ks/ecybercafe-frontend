import React from "react";
import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../contexts/useAuth";
import { errorToast } from "../utils/ToastNotfications";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login if no user is logged in
    errorToast("Please log in to access this page");
    return <Navigate to="/login" replace />;
  }

  // Check if user's role is in the allowed roles
  if (!allowedRoles.includes(user.role)) {
    // Redirect to an unauthorized page or dashboard
    errorToast("You are not authorized to access this page");
    return <Navigate to="/unauthorized" replace />;
  }

  // If user is authorized, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
