import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getToken,
    getCurrentUser,
    loginUser,
    logoutUser,
} from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Restore the session when the app starts or refreshes.
    useEffect(() => {
        let isMounted = true;

        async function restoreSession() {
            if (!getToken()) {
                if (isMounted) setIsLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();

                if (isMounted) {
                    setUser(currentUser);
                }
            } catch {
                logoutUser();
                if (isMounted) {
                    setUser(null);
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        restoreSession();

        return () => {
            isMounted = false;
        };
    }, []);

    // Log in and fetch the authenticated user's details.
    const login = useCallback(async (credentials) => {
        await loginUser(credentials);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
    }, []);

    // Clear the local session.
    const logout = useCallback(() => {
        logoutUser();
        setUser(null);
    }, []);

    const value = {
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// Access authentication state and actions from any component.
export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside an AuthProvider.");
    }

    return context;
}
