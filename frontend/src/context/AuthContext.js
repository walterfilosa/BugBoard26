import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedRole = localStorage.getItem("userRole");
        const storedId = localStorage.getItem("userId");
        const storedEmail = localStorage.getItem("userEmail");

        if (storedToken && storedRole && storedId) {
            setUser({
                token: storedToken,
                role: storedRole,
                id: storedId,
                email: storedEmail
            });
        }
        setLoading(false);
    }, []);

    const login = (token) => {
        const decoded = jwtDecode(token);

        if (!decoded) {
            console.error("Token non valido");
            return;
        }

        const isBackendAdmin = decoded.admin === true;

        const roleString = isBackendAdmin ? "admin" : "user";

        const userEmail = decoded.sub;
        const userId = decoded.id || decoded.idUtente;

        localStorage.setItem("token", token);
        localStorage.setItem("userRole", roleString);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userEmail", userEmail);

        setUser({
            token: token,
            role: roleString,
            id: userId,
            email: userEmail
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        setUser(null);
    };

    const isAdmin = user?.role === "admin";

    const value = {
        user,
        login,
        logout,
        isAdmin,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};