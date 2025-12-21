import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ allowedRole }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/" replace />;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            localStorage.removeItem('token');
            return <Navigate to="/" replace />;
        }

        let userRole = 'user'; // Default

        if (decoded.admin === true || decoded.isAdmin === true || String(decoded.admin) === 'true') {
            userRole = 'admin';
        }
        else if (decoded.role || decoded.Role) {
            const rawRole = decoded.role || decoded.Role;
            if (String(rawRole).toLowerCase() === 'admin') {
                userRole = 'admin';
            }
        }

        if (allowedRole && userRole !== allowedRole) {

            if (userRole === 'admin') {
                return <Navigate to="/admin/home" replace />;
            }
            if (userRole === 'user' && allowedRole === 'admin') {
                return <Navigate to="/home" replace />;
            }

            return <Navigate to="/" replace />;
        }

        return <Outlet/>;
    }
    catch (error) {
        console.error("Errore token:", error);
        localStorage.removeItem("token");
        return <Navigate to="/" replace />;
    }
}

export default ProtectedRoute;