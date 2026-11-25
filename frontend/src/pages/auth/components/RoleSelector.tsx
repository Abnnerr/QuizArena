
import React from "react";
import { useTheme } from "../../../contexts/hooks/useTheme";


interface RoleSelectorProps {
    role: number;
    setRole: (role: number) => void;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
    role,
    setRole,
}) => {
    const { colors } = useTheme();

    const roles = [
        {
            id: 1,
            label: "Jogador",
            color: "#398BF3",
            background: "#398BF318",
        },
        {
            id: 2,
            label: "Host",
            color: "#D89E00",
            background: "#D89E0018",
        },
    ];

    return (
        <div>
            <label
                className="
                    block text-xs font-black
                    uppercase tracking-wider mb-2
                "
                style={{ color: colors.muted }}
            >
                Escolha seu perfil
            </label>

            <div className="grid grid-cols-2 gap-3">
                {roles.map((item) => {
                    const selected = role === item.id;

                    return (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setRole(item.id)}
                            aria-pressed={selected}
                            className="
                                flex flex-col items-center justify-center
                                gap-1.5 py-3 px-3
                                rounded-2xl border-2 border-b-4
                                font-extrabold text-xs
                                transition-all duration-150
                                active:translate-y-1
                                cursor-pointer
                            "
                            style={{
                                backgroundColor: selected
                                    ? item.background
                                    : colors.surface,
                                borderColor: selected
                                    ? item.color
                                    : colors.border,
                                color: selected
                                    ? item.color
                                    : colors.muted,
                            }}
                        >
                            <span>{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
