import { darkTheme } from "./dark";
import { lightTheme } from "./ligth";


export const themes = {
    darkTheme,
    lightTheme,
};

export type ThemeName = keyof typeof themes;
export type ThemeColors = typeof darkTheme;