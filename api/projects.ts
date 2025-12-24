import { API_URL } from "@/config/env";
import { CreateProjectDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExOTIyNy05YjRlLTFjNGItODE5Yi00ZTBmOTc0OTAwMDAiLCJpYXQiOjE3NjY1NDEyMDQsImV4cCI6MTc2NjYyNzYwNH0.uJqyruKCBBtgi4H6hgEpD8jBwz73TLU53MIcu6t9PTY';

export async function getMyProjects(): Promise<ProjectData[]> {
    const res = await fetch(`${API_URL}/projects`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });
    console.log("Res", res)

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    console.log("projects: ", json)
    return json;
}

export async function createProject(project: CreateProjectDTO): Promise<ProjectData> {
    const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(project),
    });
    console.log("Res", res)

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    console.log("project: ", json)
    return json;
}

export async function getProjectById(id: string): Promise<ProjectByIdAPIResponse> {
    const res = await fetch(`${API_URL}/projects/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });
    console.log("Res", res)

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    console.log("project: ", json)
    return json;
}

export async function getProjectTasks(id: string): Promise<TaskAPIResponse[]> {
    const res = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });
    console.log("Res", res)

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to fetch projects");
    }

    const json = await res.json();
    console.log("project: ", json)
    return json;
}