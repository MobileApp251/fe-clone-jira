import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";
import { CreateTaskDTO, TaskAPIResponse, TaskData } from "@/utils/workType";

let ACCESS_TOKEN: string | null | undefined = null;

async function initAuth() {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
}

export async function getMyTasks(): Promise<TaskData[]> {
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

export async function createTask(projectId: string, task: CreateTaskDTO): Promise<TaskData> {
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

export async function getTaskById(projectId: string, taskId: string): Promise<TaskAPIResponse> {
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

export async function deleteTask(projectId: string, taskId: string): Promise<string> {
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

    return "Delete task successfully";
}

export async function assignTask(uids: string[], projectId: string, taskId: string): Promise<{ uid: string; success: boolean; data?: any; error?: string }[]> {
    await initAuth();
    const results: { uid: string; success: boolean; data?: any; error?: string }[] = [];

    for (const uid of uids) {
        try {
            const res = await fetch(`${API_URL}/api/tasks/${uid}/${projectId}/${taskId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${ACCESS_TOKEN}`
                },
            });

            if (!res.ok) {
                if (res.status === 401) {
                    results.push({ uid, success: false, error: "UNAUTHORIZED" });
                    continue;
                }
                results.push({ uid, success: false, error: `Failed to assign member: ${uid}` });
                continue;
            }
            const text = res.text();
            results.push({ uid, success: true, data: text });
        } catch (error: any) {
            results.push({ uid, success: false, error: error.message });
        }
    }
    return results;
}

export async function unassignTask(uid: string, projectId: string, taskId: string): Promise<string> {
    await initAuth();
    const res = await fetch(`${API_URL}/api/tasks/unassign/${uid}/${projectId}/${taskId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to unassign tasks");
    }
    const text = res.text();
    return text;
}

export async function getTaskIssues(taskId: string, projectId: string) {
  const res = await fetch(
    `https://php-service-sd60.onrender.com/api/issues?task_id=${taskId}&proj_id=${projectId}`
  );

  if (!res.ok) throw new Error("Failed to fetch issues");
  return res.json()
}
