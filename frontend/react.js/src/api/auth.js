const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

const TOKEN_KEY = "devboard_access_token";

// Save the JWT after successful login.
export function saveToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

// Retrieve the saved JWT.
export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

// Remove the JWT during logout.
export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

// Shared HTTP request handler.
async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            typeof data?.detail === "string"
                ? data.detail
                : `Request failed (${response.status}). Please try again.`;

        throw new Error(message);
    }

    return data;
}

// Register a new user.
export function registerUser({ name, email, password }) {
    return request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

// Log in an existing user.
export async function loginUser({ email, password }) {
    const data = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (!data?.access_token) {
        throw new Error("The server did not return an access token.");
    }

    saveToken(data.access_token);

    return data;
}

// Get the currently authenticated user.
export function getCurrentUser() {
    const token = getToken();

    if (!token) {
        throw new Error("You are not logged in.");
    }

    return request("/auth/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}

// Log out locally.
export function logoutUser() {
    removeToken();
}
