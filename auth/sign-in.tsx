import { API_URL } from "@/config/env";
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

    await AsyncStorage.setItem("ACCESS_TOKEN", token);
    await AsyncStorage.setItem("USER_EMAIL", email);

    return { token, user };
}

let ACCESS_TOKEN: string | null = null;
let USER_EMAIL: string | null = null;

async function initAuth() {
    ACCESS_TOKEN = await AsyncStorage.getItem("ACCESS_TOKEN");
    USER_EMAIL = await AsyncStorage.getItem("USER_EMAIL");
}

export async function getUserProfile(): Promise<User> {
    await initAuth();
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