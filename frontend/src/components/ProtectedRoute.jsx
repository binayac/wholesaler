// Frontend: ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useGetUserQuery } from '../redux/features/auth/authApi';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Use RTK Query to verify the user on protected routes
  const { data, error, isLoading: queryLoading } = useGetUserQuery();

  useEffect(() => {
    if (!queryLoading) {
      if (data && data.user) {
        // User is verified by backend
        setIsVerified(true);
      } else {
        // Token invalid or expired
        setIsVerified(false);
      }
      setIsLoading(false);
    }
  }, [data, error, queryLoading]);

  // Show loading while checking auth
  if (isLoading || queryLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user in Redux state or verification failed, redirect to login
  if (!user || !isVerified) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If specific roles are required and user doesn't have permission
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role
  return children;
};

export default ProtectedRoute;