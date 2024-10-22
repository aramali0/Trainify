import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getToken, isAuthenticated } from '../helper/auth';

const PrivateRoute = ({ roles }) => {
    const token = getToken();
    const location = useLocation(); // Capture the current location
    var user;

    if (token === null || !isAuthenticated()) {
        // Pass the current location to the login page
        return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    user = JSON.parse(atob(token.split('.')[1])); // Decode JWT token
    const scopes = user.scope.split(" ");

    // Compare scopes with roles
    if (roles && roles.some(role => scopes.includes(role))) {

        return <Outlet />;
    }

    return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
