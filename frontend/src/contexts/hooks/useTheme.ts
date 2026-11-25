import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme precisa ser utilizado dentro de ThemeProvider");
    }

    return context;
};