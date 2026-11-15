
import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactNode;
    color?: string;
    border?: string;
    rightElement?: React.ReactNode;
}

export const Input: React.FC<AuthInputProps> = ({
    label,
    icon,
    rightElement,
    color,
    border,
    ...props
}) => {
    const { colors } = useTheme();

    return (
        <div className="w-full">
            {label && (
                <label
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
                    style={{
                        ...props.style,
                        borderColor: border || colors.border,
                        backgroundColor: color || colors.surface,
                        color: colors.text,
                        "--input-placeholder": colors.muted,
                        "--input-focus": "#1CB0F6",
                    } as React.CSSProperties}
                    className={`
                        w-full border-2 border-b-4 rounded-2xl
                        font-black
                        placeholder:opacity-60
                        focus:outline-none focus:border-[#1CB0F6]
                        transition-all duration-200
                        ${icon ? "pl-12" : "pl-4"}
                        ${rightElement ? "pr-12" : "pr-4"}
                        py-3.5 text-base sm:text-lg
                    `}
                />

                {rightElement && (
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
                        {rightElement}
                    </div>
                )}
            </div>
        </div>
    );
};
