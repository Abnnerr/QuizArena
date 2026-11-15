import { createContext, useContext, useEffect, useState } from "react";
import type { ThemeContextData } from "./types/themeTypes";
import { themes, type ThemeName } from "../shared/themes";


export const ThemeContext = createContext<ThemeContextData | null>(null)
const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeName>(() => {
        const saved = localStorage.getItem("quiz-arena-theme");

        return saved && saved in themes
            ? saved as ThemeName
            : "darkTheme";
    });

    const colors = themes[theme];

    useEffect(() => {
        localStorage.setItem("quiz-arena-theme", theme);
    }, [theme]);
    return (
        <ThemeContext.Provider value={{ theme, colors, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;


export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme precisa ser utilizado dentro de ThemeProvider");
    }

    return context;
};