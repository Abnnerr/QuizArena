import React from "react";
import type { Colors } from "../../../../../shared/types/types";

interface ResetPasswordHeaderProps {
    colors: Colors;
}

const ResetPasswordHeader: React.FC<ResetPasswordHeaderProps> = ({
    colors,
}) => {
    return (
        <div
            className="
                w-full flex flex-col sm:flex-row
                items-center justify-center
                gap-4 mb-6
            "
        >
            <div
                className="
                    rounded-3xl border-2 border-b-8
                    p-3 shadow-sm flex-shrink-0
                    flex items-center justify-center
                    transform hover:scale-105 transition-transform
                    w-24 h-24 sm:w-28 sm:h-28
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-full w-full object-contain"
                />
            </div>

            <div
                className="
                    relative border-2 border-b-4
                    rounded-2xl shadow-sm w-full
                    text-center sm:text-left
                    p-4 sm:p-5
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="
                        hidden sm:block absolute -left-3
                        top-1/2 -translate-y-1/2
                        w-0 h-0 border-y-8 border-y-transparent
                    "
                    style={{
                        borderRight: `8px solid ${colors.border}`,
                    }}
                />

                <div
                    className="
                        hidden sm:block absolute -left-2
                        top-1/2 -translate-y-1/2
                        w-0 h-0 border-y-6 border-y-transparent
                    "
                    style={{
                        borderRight: `6px solid ${colors.card}`,
                    }}
                />

                <h2
                    className="
                        font-black tracking-tight
                        text-xl sm:text-2xl
                    "
                    style={{ color: colors.text }}
                >
                    Crie sua nova senha
                </h2>

                <p
                    className="
                        font-extrabold mt-1
                        text-xs sm:text-sm
                    "
                    style={{ color: colors.muted }}
                >
                    Escolha uma senha forte para manter sua conta protegida.
                </p>
            </div>
        </div>
    );
};

export default ResetPasswordHeader;