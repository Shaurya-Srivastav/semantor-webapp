// withAuthProtection.js
import React from 'react';
import { useAuth } from '../context/AuthContext'; // Corrected import path
import { Navigate } from 'react-router-dom';

const withAuthProtection = (WrappedComponent) => {
  return (props) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
      return <Navigate to="/signup" />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuthProtection;
