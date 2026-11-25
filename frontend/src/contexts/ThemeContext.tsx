import { createContext } from "react";
import type { ThemeContextData } from "./types/themeTypes";


export const ThemeContext = createContext<ThemeContextData | null>(null)
