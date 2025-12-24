import { API_URL } from "@/config/env";
import { TaskAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExOTIyNy05YjRlLTFjNGItODE5Yi00ZTBmOTc0OTAwMDAiLCJpYXQiOjE3NjY1NDEyMDQsImV4cCI6MTc2NjYyNzYwNH0.uJqyruKCBBtgi4H6hgEpD8jBwz73TLU53MIcu6t9PTY';

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
