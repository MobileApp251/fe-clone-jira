import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";
import { NotificationType } from "@/utils/notification";

let ACCESS_TOKEN: string | null | undefined = null;

async function initAuth() {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
}

export async function searchUserByEmailPattern(pattern: string): Promise<string[]> {
    await initAuth();
    const res = await fetch(`${API_URL}/users/email?pattern=${pattern}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to search user");
    }

    const json = await res.json();
    return json;
}

export async function getUserNotifications(): Promise<NotificationType[]> {
    await initAuth();
    const res = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        if (res.status === 401) {
            throw new Error("UNAUTHORIZED");
        }
        throw new Error("Failed to search user");
    }

    const json = await res.json();
    return json;
}