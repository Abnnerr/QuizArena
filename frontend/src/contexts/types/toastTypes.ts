
export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastData {
    id: number;
    message: string;
    type: ToastType;
    duration: number;
}

export interface ToastContextData {
    toasts: ToastData[];
    toast: {
        success: (message: string, duration?: number) => void;
        error: (message: string, duration?: number) => void;
        warning: (message: string, duration?: number) => void;
        info: (message: string, duration?: number) => void;
    };
    removeToast: (id: number) => void;
}