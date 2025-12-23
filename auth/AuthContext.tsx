import React, { createContext, useContext, useEffect, useState } from "react";
import { tokenStore } from "./token";

type AuthState = {
    accessToken: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    setTokens: (access: string, refresh: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState|null>(null);

export function AuthProvider ({ children }: { children: React.ReactNode }) {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            const token = await tokenStore.getAccessToken();
            setAccessToken(token);
            setLoading(false);
        };
        loadToken();
    }, []);

    const setTokens = async (access: string) => {
        await tokenStore.setAccessToken(access);
        setAccessToken(access);
    };

    const logout = async () => {
        await tokenStore.removeAccessToken();
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                accessToken,
                loading,
                isAuthenticated: !!accessToken,
                setTokens,
                logout,
            }}
        >
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