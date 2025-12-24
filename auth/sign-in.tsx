import { API_URL } from "@/config/env";
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

    return { token, user };
}
