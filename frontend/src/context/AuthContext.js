import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    logout();
                } else {
                    setUser({
                        id: decoded.sub,
                        role: decoded.role,
                        email: decoded.email,
                        token: storedToken
                    });
                }
            } catch (error) {
                console.error("Token non valido", error);
                logout();
            }
        }
        setLoading(false);
    }, []);

    // Funzione di Login
    const login = (token) => {
        localStorage.setItem("token", token);
        const decoded = jwtDecode(token);

        setUser({
            id: decoded.userId || decoded.sub,
            role: decoded.role,
            email: decoded.email,
            token: token
        });
    };

    const logout = () => {
        localStorage.removeItem("token");
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