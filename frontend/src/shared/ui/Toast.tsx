
import { useEffect } from "react";
import type { ReactNode } from "react";

import {
    FiCheckCircle,
    FiAlertCircle,
    FiAlertTriangle,
    FiInfo,
    FiX,
} from "react-icons/fi";
import type { ToastData, ToastType } from "../../contexts/types/toastTypes";
import { useToast } from "../../contexts/hooks/useToast";


type ToastPosition =
    | "top-right"
    | "top-left"
    | "top-center"
    | "bottom-right"
    | "bottom-left"
    | "bottom-center";

interface ToastProps {
    position?: ToastPosition;
}

const toastStyles: Record<
    ToastType,
    {
        icon: ReactNode;
        color: string;
        background: string;
        title: string;
    }
> = {
    success: {
        icon: <FiCheckCircle size={22} />,
        color: "#16A36A",
        background: "rgba(22, 163, 106, 0.10)",
        title: "Sucesso",
    },
    error: {
        icon: <FiAlertCircle size={22} />,
        color: "#EF4444",
        background: "rgba(239, 68, 68, 0.10)",
        title: "Erro",
    },
    warning: {
        icon: <FiAlertTriangle size={22} />,
        color: "#E5A000",
        background: "rgba(229, 160, 0, 0.10)",
        title: "Atenção",
    },
    info: {
        icon: <FiInfo size={22} />,
        color: "#1CB0F6",
        background: "rgba(28, 176, 246, 0.10)",
        title: "Informação",
    },
};

const positionStyles: Record<ToastPosition, string> = {
    "top-right": "top-4 right-4 items-end",
    "top-left": "top-4 left-4 items-start",
    "top-center": "top-4 left-1/2 -translate-x-1/2 items-center",

    "bottom-right": "bottom-4 right-4 items-end",
    "bottom-left": "bottom-4 left-4 items-start",
    "bottom-center": "bottom-4 left-1/2 -translate-x-1/2 items-center",
};

interface ToastItemProps {
    item: ToastData;
    onClose: (id: number) => void;
}

const ToastItem = ({ item, onClose }: ToastItemProps) => {
    const style = toastStyles[item.type];

    useEffect(() => {
        if (item.duration <= 0) return;

        const timer = setTimeout(() => {
            onClose(item.id);
        }, item.duration);

        return () => clearTimeout(timer);
    }, [item.id, item.duration, onClose]);

    return (
        <div
            role={item.type === "error" ? "alert" : "status"}
            className="flex w-full items-start gap-3 rounded-xl border-2 border-b-4 bg-white p-4 shadow-xl"
            style={{
                borderColor: style.color,
                borderBottomColor: style.color,
                animation: "toastIn 0.25s ease-out",
            }}
        >
            <div
                className="flex shrink-0 items-center justify-center rounded-lg p-2"
                style={{
                    color: style.color,
                    background: style.background,
                }}
            >
                {style.icon}
            </div>

            <div className="min-w-0 flex-1">
                <p
                    className="font-black"
                    style={{ color: style.color }}
                >
                    {style.title}
                </p>

                <p className="mt-1 break-words text-sm font-medium text-gray-700">
                    {item.message}
                </p>
            </div>

            <button
                type="button"
                onClick={() => onClose(item.id)}
                aria-label="Fechar notificação"
                className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
            >
                <FiX size={19} />
            </button>
        </div>
    );
};

const Toast = ({ position = "top-right" }: ToastProps) => {
    const { toasts, removeToast } = useToast();

    return (
        <>
            <div
                className={`pointer-events-none fixed z-[9999] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3 ${positionStyles[position]}`}
            >
                {toasts.map((item: ToastData) => (
                    <div key={item.id} className="pointer-events-auto w-full">
                        <ToastItem
                            item={item}
                            onClose={removeToast}
                        />
                    </div>
                ))}
            </div>

            <style>
                {`
                    @keyframes toastIn {
                        from {
                            opacity: 0;
                            transform: translateX(30px);
                        }
                        to {
                            opacity: 1;
                            transform: translateX(0);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default Toast;
