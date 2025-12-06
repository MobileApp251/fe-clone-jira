import { Colors } from "@/constants/theme";
import React, { createContext, ReactNode, useContext, useState } from "react";
import { useColorScheme } from "react-native";

export type ThemeMode = "light" | "dark";

export interface ThemeContextType {
    theme: ThemeMode;
    setTheme: (mode: ThemeMode) => void;
    colors: typeof Colors.light;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface Props {
    children: ReactNode;
}

export function ThemeProvider({ children }: Props) {
    const systemTheme = useColorScheme() as ThemeMode;
    const [theme, setTheme] = useState<ThemeMode>(systemTheme ?? "light");

    const value: ThemeContextType = {
        theme,
        setTheme,
        colors: theme === "light" ? Colors.light : Colors.dark,
    };

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return context;
}
