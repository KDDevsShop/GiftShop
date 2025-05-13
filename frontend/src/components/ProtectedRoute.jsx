import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  // Retrieve user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  console.log(user);

  // If no user is logged in, redirect to login page
  if (!user) {
    return <Navigate to='/login' replace />;
  }

  // If the user's role isn't in the allowed roles, redirect to unauthorized page
  if (!allowedRoles.includes(user.role.role)) {
    return <Navigate to='/unauthorized' replace />;
  }

  // If everything checks out, render the protected content
  return children;
};

export default ProtectedRoute;
