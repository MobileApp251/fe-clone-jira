import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";

export async function signUp(email: string, password: string) {
    const notiToken = await tokenCache?.getToken("pushToken");
    const res = await fetch(`${API_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, noti_token: notiToken }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Sign up failed: ${msg}`);
    }

    const { token, user } = await res.json();

    await tokenCache?.saveToken("ACCESS_TOKEN", token);

    return { token, user };
}
