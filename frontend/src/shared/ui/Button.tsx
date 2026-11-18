
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
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
    ...props
}) => {
    const { colors } = useTheme();

    const variants: Record<ButtonVariant, React.CSSProperties> = {
        primary: {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
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
        sm: "px-3 py-2 text-sm",
        md: "px-5 py-3 text-base",
        lg: "px-7 py-4 text-lg",
    };

    return (
        <button
            {...props}
            type={type}
            disabled={disabled || isLoading}
            style={variants[variant]}
            className={`
                inline-flex items-center justify-center gap-2
                border-2 border-b-4 rounded-2xl
                font-black uppercase tracking-wide
                cursor-pointer
                transition-all duration-150
                active:translate-y-[2px]
                active:border-b-2
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:active:translate-y-0
                ${sizes[size]}
                ${fullWidth ? "w-full" : ""}
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
                    <span>Carregando...</span>
                </>
            ) : (
                <>
                    {leftIcon && <span className="shrink-0">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="shrink-0">{rightIcon}</span>}
                </>
            )}
        </button>
    );
};

export default Button;
