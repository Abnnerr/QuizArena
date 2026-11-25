
import {
    createContext,
} from "react";
import type { ToastContextData } from "./types/toastTypes";


export const ToastContext = createContext<ToastContextData | null>(null);



