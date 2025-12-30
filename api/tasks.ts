import { API_URL } from "@/config/env";
import { CreateTaskDTO, TaskAPIResponse, TaskData } from "@/utils/workType";
import AsyncStorage from "@react-native-async-storage/async-storage";

let ACCESS_TOKEN: string | null = null;

async function initAuth() {
    ACCESS_TOKEN = await AsyncStorage.getItem("ACCESS_TOKEN");
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