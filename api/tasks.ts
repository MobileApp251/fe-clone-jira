import { API_URL } from "@/config/env";
import { TaskAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExZTZiNC05YjRmLTE2NDMtODE5Yi00Zjk4MDMyNjAwMDAiLCJpYXQiOjE3NjY1NjY5MjEsImV4cCI6MTc2NjY1MzMyMX0.kBVLp4Eo12pXpulhmvcxrGPhWL19MhZ557M8AWmPjAU';

export async function getMyTasks(): Promise<TaskAPIResponse[]> {
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
