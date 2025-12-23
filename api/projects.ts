import { API_URL } from "@/config/env";
import { ProjectAPIResponse } from "@/utils/workType";

const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIwYTExNDcyOC05YjQzLTE1ZTQtODE5Yi00NDA3NTlmYzAwMDAiLCJpYXQiOjE3NjYzNzI4OTEsImV4cCI6MTc2NjQ1OTI5MX0.Te4-uO2hXw9M_1jdo_VIE0MINJ_ahhMs220GUfx2MP0'

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