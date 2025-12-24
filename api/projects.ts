import { API_URL } from "@/config/env";
import { CreateProjectDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExZTZiNC05YjRmLTE2NDMtODE5Yi00Zjk4MDMyNjAwMDAiLCJpYXQiOjE3NjY1NjY5MjEsImV4cCI6MTc2NjY1MzMyMX0.kBVLp4Eo12pXpulhmvcxrGPhWL19MhZ557M8AWmPjAU';

export async function getMyProjects(): Promise<ProjectData[]> {
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
    console.log(project);
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