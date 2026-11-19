import React from "react";
import { useTheme } from "../../../../../contexts/ThemeContext";

const PlayerNameHeader: React.FC = () => {
    const { colors } = useTheme();

    return (
        <div className="flex flex-col items-center text-center gap-4">
            <div
                className="
                    rounded-3xl border-2 border-b-8
                    p-3 shadow-sm flex-shrink-0
                    flex items-center justify-center
                    w-24 h-24 sm:w-28 sm:h-28
                    transform hover:scale-105 transition-transform
                "
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                }}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-full w-full object-contain"
                />
            </div>

            <div className="space-y-2">
                <h1
                    className="
                        font-black tracking-tight
                        text-xl sm:text-2xl
                    "
                    style={{ color: colors.text }}
                >
                    Escolha seu apelido!
                </h1>

                <p
                    className="
                        font-extrabold
                        text-xs sm:text-sm
                    "
                    style={{ color: colors.muted }}
                >
                    Como os outros jogadores vão te conhecer na arena?
                </p>
            </div>
        </div>
    );
};

export default PlayerNameHeader;