import { getToken } from "./auth";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

// Shared request handler for project APIs.
async function request(endpoint, options = {}) {
    const token = getToken();

    if (!token) {
        throw new Error("You are not logged in.");
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    // DELETE may return 204 No Content.
    if (response.status === 204) {
        return null;
    }

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

// Fetch all projects belonging to the authenticated user.
export function getProjects() {
    return request("/projects/all_projects");
}

// Create a new project.
export function createProject(projectData) {
    return request("/projects/", {
        method: "POST",
        body: JSON.stringify(projectData),
    });
}

// Update an existing project.
export function updateProject(projectId, projectData) {
    return request(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(projectData),
    });
}

// Delete an existing project.
export function deleteProject(projectId) {
    return request(`/projects/${projectId}`, {
        method: "DELETE",
    });
}
