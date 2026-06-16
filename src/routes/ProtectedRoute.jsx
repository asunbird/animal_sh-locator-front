import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../provider/authContext.jsx";

// define the ProtectedRoute component, which will serve as a wrapper for authenticated routes
export const ProtectedRoute = () => {
  const { token } = useAuth();

  // Check if the user is authenticated
  if (!token) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

