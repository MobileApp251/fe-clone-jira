import { API_URL } from "@/config/env";
import { tokenCache } from "@/utils/cache";
import { User } from "@/utils/userType";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function signIn(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Sign in failed: ${msg}`);
    }

    const { token, user } = await res.json();

    await AsyncStorage.setItem("USER_EMAIL", email);
    await tokenCache?.saveToken("ACCESS_TOKEN", token);

    return { token, user };
}

export async function GoogleSignIn(idToken: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: idToken }),
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Sign in failed: ${msg}`);
    }

    const { token } = await res.json();
    await tokenCache?.saveToken("ACCESS_TOKEN", token);
}

let ACCESS_TOKEN: string | null | undefined = null;
let USER_EMAIL: string | null = null;

async function initAuth() {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
    USER_EMAIL = await AsyncStorage.getItem("USER_EMAIL");
}

export async function getUserProfile(): Promise<User> {
    ACCESS_TOKEN = await tokenCache?.getToken("ACCESS_TOKEN");
    USER_EMAIL = await AsyncStorage.getItem("USER_EMAIL");

    console.log("getUserProfile - ACCESS_TOKEN:", ACCESS_TOKEN);
    console.log("getUserProfile - USER_EMAIL:", USER_EMAIL);
    if (!USER_EMAIL || !ACCESS_TOKEN) {
        throw new Error("Missing auth info");
    }
    const params = new URLSearchParams({
        email: USER_EMAIL,
    });
    const res = await fetch(`${API_URL}/users?${params.toString()}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
    });

    if (!res.ok) {
        const msg = await res.text();
        throw new Error(`Get user profile: ${msg}`);
    }

    const data: User = await res.json();
    return data;
}