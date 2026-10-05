import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    function login() {
        setUser({
            name: "Viraj",
            email: "viraj@example.com",
        });

        setIsAuthenticated(true);
    }

    function logout() {
        setUser(null);
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}