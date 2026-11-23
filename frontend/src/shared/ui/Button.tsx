
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export type ButtonVariant =
    | "primary"
    | "secondary"
    | "success"
    | "danger"
    | "outline"
    | "ghost";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    color?: string;
    borderColor?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    className = "",
    disabled,
    type = "button",
    color,
    borderColor,
    ...props
}) => {
    const { colors } = useTheme();

    const variants: Record<ButtonVariant, React.CSSProperties> = {
        primary: {
            backgroundColor: "#1CB0F6",
            borderColor: "#0092D6",
            color: "#FFFFFF",
        },
        secondary: {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
        },
        success: {
            backgroundColor: colors.success,
            borderColor: colors.success,
            color: "#FFFFFF",
        },
        danger: {
            backgroundColor: colors.danger,
            borderColor: colors.danger,
            color: "#FFFFFF",
        },
        outline: {
            backgroundColor: "transparent",
            borderColor: colors.border,
            color: colors.text,
        },
        ghost: {
            backgroundColor: "transparent",
            borderColor: "transparent",
            color: colors.text,
        },
    };

    const sizes: Record<ButtonSize, string> = {
        sm: "px-3 h-10 text-xs",
        md: "px-4 h-13 text-sm",
        lg: "px-7 h-14 text-base",
        icon: "w-11 h-11 !p-0",
    };

    const isIcon = size === "icon";

    return (
        <button
            {...props}
            type={type}
            disabled={disabled || isLoading}
            style={{
                ...variants[variant],
                ...(color ? { color } : {}),
                ...(borderColor ? { borderColor } : {}),
            }}
            className={`
                inline-flex items-center justify-center gap-3
                border-2 border-b-4 rounded-xl
                active:border-b-2 active:translate-y-0.5
                transition-all
                font-black uppercase tracking-wide
                cursor-pointer
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:active:translate-y-0
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
                ${isIcon ? "!gap-0" : ""}
                ${className}
            `}
        >
            {isLoading ? (
                <>
                    <span className="
                        w-4 h-4 border-2 border-current
                        border-t-transparent rounded-full
                        animate-spin
                    " />
                    {!isIcon && <span>Carregando...</span>}
                </>
            ) : (
                <>
                    {leftIcon && (
                        <span className="shrink-0">{leftIcon}</span>
                    )}
                    {children}
                    {rightIcon && (
                        <span className="shrink-0">{rightIcon}</span>
                    )}
                </>
            )}
        </button>
    );
};

export default Button;
