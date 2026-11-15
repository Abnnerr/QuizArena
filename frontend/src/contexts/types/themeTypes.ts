import type { ThemeName, themes } from "../../shared/themes";


export type ThemeContextData = {
    theme: ThemeName;
    colors: (typeof themes)[ThemeName];
    setTheme: (theme: ThemeName) => void;
}