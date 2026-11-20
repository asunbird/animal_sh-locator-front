import { useContext } from 'react';
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from '../provider/authContext.js';

// define the ProtectedRoute component, which will serve as a wrapper for authenticated routes
export const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AuthContext);

  // Check if the user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/components/signin" replace />;
  }
  // If authenticated, render the child routes
  return <Outlet />;
};

