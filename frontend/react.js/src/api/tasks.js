
import { getToken } from "./auth";

const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:8000";

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

export function getProjectTasks(projectId) {
    return request(`/tasks/project/${projectId}`);
}

export function createTask(taskData) {
    return request("/tasks/", {
        method: "POST",
        body: JSON.stringify(taskData),
    });
}

export function updateTask(taskId, taskData) {
    return request(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(taskData),
    });
}

export function deleteTask(taskId) {
    return request(`/tasks/${taskId}`, {
        method: "DELETE",
    });
}
