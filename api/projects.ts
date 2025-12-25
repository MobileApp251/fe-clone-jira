import { API_URL } from "@/config/env";
import { CreateProjectDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse } from "@/utils/workType";
import AsyncStorage from "@react-native-async-storage/async-storage";

let ACCESS_TOKEN: string | null = null;

async function initAuth() {
    ACCESS_TOKEN = await AsyncStorage.getItem("ACCESS_TOKEN");
}

export async function getMyProjects(): Promise<ProjectData[]> {
    await initAuth();
    const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    return json;
}

export async function createProject(project: CreateProjectDTO): Promise<ProjectData> {
    await initAuth();
    const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(project),
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    return json;
}

export async function getProjectById(id: string): Promise<ProjectByIdAPIResponse> {
    await initAuth();
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    return json;
}

export async function getProjectTasks(id: string): Promise<TaskAPIResponse[]> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    return json;
}