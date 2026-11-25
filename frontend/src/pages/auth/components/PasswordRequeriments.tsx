
import React from "react";
import { BiCheck } from "react-icons/bi";
import { useTheme } from "../../../contexts/hooks/useTheme";


interface Requirement {
    label: string;
    met: boolean;
}

interface PasswordRequirementsProps {
    requirements: Requirement[];
}

export const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
    requirements,
}) => {
    const { colors } = useTheme();

    return (
        <div className="mt-3 grid grid-cols-2 gap-2">
            {requirements.map((req, index) => (
                <div
                    key={index}
                    className="
                        flex items-center gap-2
                        px-3 py-2.5
                        rounded-xl border-2 border-b-4
                        transition-all duration-150
                        select-none min-w-0
                    "
                    style={{
                        backgroundColor: req.met
                            ? `${colors.success}18`
                            : colors.surface,
                        borderColor: req.met
                            ? colors.success
                            : colors.border,
                        color: req.met
                            ? colors.success
                            : colors.muted,
                    }}
                >
                    <div
                        className="
                            w-4 h-4 rounded-full
                            flex items-center justify-center
                            shrink-0 transition-all
                        "
                        style={{
                            backgroundColor: req.met
                                ? colors.success
                                : colors.border,
                            color: req.met
                                ? "#FFFFFF"
                                : "transparent",
                        }}
                    >
                        {req.met && (
                            <BiCheck className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                    </div>

                    <span
                        className="
                            text-xs font-black
                            leading-tight truncate tracking-wide
                        "
                    >
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    );
};
