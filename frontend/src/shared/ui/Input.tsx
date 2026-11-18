
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    icon?: React.ReactNode;
    color?: string;
    border?: string;
    rightElement?: React.ReactNode;
    error?: string;
    containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
    label,
    icon,
    rightElement,
    color,
    border,
    error,
    containerClassName = "",
    className = "",
    id,
    style,
    ...props
}) => {
    const { colors } = useTheme();

    const inputId = id || React.useId();

    return (
        <div className={`w-full ${containerClassName}`}>
            {label && (
                <label
                    htmlFor={inputId}
                    className="
                        block font-bold uppercase tracking-wider
                        mb-1.5 text-xs
                    "
                    style={{ color: colors.muted }}
                >
                    {label}
                </label>
            )}

            <div className="relative w-full">
                {icon && (
                    <div
                        className="
                            absolute inset-y-0 left-0 pl-3.5
                            flex items-center pointer-events-none
                        "
                        style={{ color: colors.primary }}
                    >
                        {icon}
                    </div>
                )}

                <input
                    {...props}
                    id={inputId}
                    aria-invalid={!!error}
                    aria-describedby={error ? `${inputId}-error` : undefined}
                    style={{
                        ...style,
                        borderColor: error
                            ? colors.danger
                            : border || colors.border,
                        backgroundColor: color || colors.surface,
                        color: colors.text,
                    }}
                    className={`
                        w-full border-2 border-b-4 rounded-2xl
                        font-black
                        placeholder:opacity-60
                        focus:outline-none focus:border-[#1CB0F6]
                        transition-all duration-200
                        ${icon ? "pl-12" : "pl-4"}
                        ${rightElement ? "pr-12" : "pr-4"}
                        py-3.5 text-base sm:text-lg
                        ${className}
                    `}
                />

                {rightElement && (
                    <div className="
                        absolute inset-y-0 right-0 pr-3.5
                        flex items-center
                    ">
                        {rightElement}
                    </div>
                )}
            </div>

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="mt-1.5 text-xs font-bold"
                    style={{ color: colors.danger }}
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
