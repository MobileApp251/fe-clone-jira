import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";
import { CreateTaskDTO, TaskAPIResponse, TaskData } from "@/utils/workType";

let ACCESS_TOKEN: string | null | undefined = null;

async function initAuth() {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
}

export async function getMyTasks(): Promise<TaskAPIResponse[]> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch tasks");
    }

    const json = await res.json();
    return json;
}

export async function createTask(projectId: string, task: CreateTaskDTO): Promise<TaskAPIResponse> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/${projectId}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch tasks");
    }

    const json = await res.json();
    return json;
}

export async function getTaskById(projectId: string, taskId: string): Promise<TaskData> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/${projectId}/${taskId}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch tasks");
    }

    const json = await res.json();
    return json;
}

export async function updateTask(projectId: string, taskId: string, task: CreateTaskDTO): Promise<TaskData> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/${projectId}/${taskId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch tasks");
    }

    const json = await res.json();
    return json;
}

export async function deleteTask(projectId: string, taskId: string): Promise<TaskData> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/${projectId}/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch tasks");
    }

    const json = await res.json();
    return json;
}
