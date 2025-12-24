import { API_URL } from "@/config/env";
import { TaskAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTEwODkxNC05YjQ4LTFjMTItODE5Yi00OTAyZDI1YTAwMDEiLCJpYXQiOjE3NjY0NTY0ODAsImV4cCI6MTc2NjU0Mjg4MH0.odrWRH0jmvXBekzvUg-n-DonJR3CovzlKww0MFmLTzQ';

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
