import { API_URL } from "@/config/env";
import { ProjectAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTEwODkxNC05YjQ4LTFjMTItODE5Yi00OTAwNTdlYTAwMDAiLCJpYXQiOjE3NjY0NTYzMTksImV4cCI6MTc2NjU0MjcxOX0.KmmJeS64e7zxSF-WebpAU6eoDmbI5t45-V-2smaenMQ'

export async function getMyProjects(): Promise<ProjectAPIResponse[]> {
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