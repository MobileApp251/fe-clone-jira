import * as Linking from "expo-linking";
import { createContext, useContext, useEffect, useState } from "react";
import { loginWithGoogle } from "./LoginGoogle";
import { tokenStore } from "./token";

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        tokenStore.get().then(t => {
            setToken(t);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        const sub = Linking.addEventListener("url", async ({ url }) => {
            const { queryParams } = Linking.parse(url);
            const accessToken = queryParams?.access_token as string;

            if (accessToken) {
                await tokenStore.set(accessToken);
                setToken(accessToken);
            }
        });

        return () => sub.remove();
    }, []);

    const login = async () => {
        await loginWithGoogle();
    };

    const logout = async () => {
        await tokenStore.clear();
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}
