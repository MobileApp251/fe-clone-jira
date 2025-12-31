import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";
import { CreateProjectDTO, ProjectByIdAPIResponse, ProjectData, TaskAPIResponse, UpdateProjectDTO } from "@/utils/workType";

let ACCESS_TOKEN: string | null | undefined = null;

async function initAuth() {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
}

export async function getMyProjects(): Promise<ProjectByIdAPIResponse[]> {
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

export async function deleteProjectById(projectId: string): Promise<string> {
    await initAuth();
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "DELETE",
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

    return "Delete project successfully";
}

export async function updateProject(projectId: string, payload: UpdateProjectDTO): Promise<ProjectData> {
    await initAuth();
    const res = await fetch(`${API_URL}/projects/${projectId}`, {
        method: "PATCH",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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