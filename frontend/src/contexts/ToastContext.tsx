
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

interface ToastContextData {
    toasts: ToastData[];
    toast: {
        success: (message: string, duration?: number) => void;
        error: (message: string, duration?: number) => void;
        warning: (message: string, duration?: number) => void;
        info: (message: string, duration?: number) => void;
    };
    removeToast: (id: number) => void;
}

export const ToastContext = createContext<ToastContextData | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
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


export const useToast = () => {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast precisa ser utilizado dentro de um ToastProvider"
        );
    }

    return context;
};
