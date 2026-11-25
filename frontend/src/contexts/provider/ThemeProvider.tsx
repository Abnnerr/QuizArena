import { useEffect, useState } from "react";
import { ThemeContext } from "../ThemeContext";
import { themes, type ThemeName } from "../../shared/themes";

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

