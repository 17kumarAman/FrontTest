import React from 'react';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const isLoggedIn = !!localStorage.getItem('admin');

    if (!isLoggedIn) {
        toast.error('Please login to access the admin dashboard');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;