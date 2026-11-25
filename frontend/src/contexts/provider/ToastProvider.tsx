import { useCallback, useState, type ReactNode } from "react";
import { ToastContext } from "../ToastContext";
import type { ToastData, ToastType } from "../types/toastTypes";



export const ToastProvider = ({ children }: { children: ReactNode}) => {
    const [toasts, setToasts] = useState<ToastData[]>([]);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const addToast = useCallback(
        (message: string, type: ToastType, duration = 3000) => {
            const id = Date.now() + Math.random();

            setToasts((prev) => [
                ...prev,
                {
                    id,
                    message,
                    type,
                    duration,
                },
            ]);
        },
        []
    );

    const toast = {
        success: (message: string, duration?: number) =>
            addToast(message, "success", duration),
        error: (message: string, duration?: number) =>
            addToast(message, "error", duration),
        warning: (message: string, duration?: number) =>
            addToast(message, "warning", duration),
        info: (message: string, duration?: number) =>
            addToast(message, "info", duration),
    };

    return (
        <ToastContext.Provider value={{ toasts, toast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};
