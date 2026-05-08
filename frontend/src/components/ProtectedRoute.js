import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/login');

  useEffect(() => {
    // Only check redirects on initial mount, not on every render
    if (!isAuthenticated()) {
      setRedirectPath('/login');
      setShouldRedirect(true);
      return;
    }

    const userRole = getUserRole();
    
    // Only redirect if user doesn't have access AND isn't already on a valid page
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      // Check if current path is already valid for this role
      var currentPath = location.pathname;
      
      if (userRole === 'student' || userRole === 'faculty') {
        // Students/faculty can only access student pages
        if (!currentPath.startsWith('/student') && currentPath !== '/login') {
          setRedirectPath('/student/equipment');
          setShouldRedirect(true);
        }
      } else {
        // Admin/technician can access admin pages
        if (currentPath.startsWith('/student') && currentPath !== '/student/equipment') {
          setRedirectPath('/dashboard');
          setShouldRedirect(true);
        }
      }
    }
    // If user has access, don't redirect
  }, []); // Empty dependency array = run only once on mount

  if (shouldRedirect) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;