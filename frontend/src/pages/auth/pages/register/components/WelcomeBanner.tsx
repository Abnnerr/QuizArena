
import React from "react";
import type { RegisterColors } from "../types/types";

interface WelcomeBannerProps {
    colors: RegisterColors;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ colors }) => {
    return (
        <div
            className="
                w-full flex flex-col sm:flex-row
                items-center justify-center
                gap-3 mb-4
            "
        >
            <div
                className="
                    rounded-3xl border-2 border-b-8
                    shadow-lg flex-shrink-0
                    flex items-center justify-center
                    transform hover:scale-105 transition-transform
                    w-20 h-20 sm:w-24 sm:h-24 p-3
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-full w-full object-contain filter drop-shadow"
                />
            </div>

            <div
                className="
                    relative w-full sm:w-auto
                    border-2 border-b-4 rounded-2xl
                    text-center sm:text-left shadow-lg
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
                    className="font-black tracking-tight text-xl sm:text-2xl"
                    style={{ color: colors.text }}
                >
                    Crie sua conta de Host!
                </h2>

                <p
                    className="font-extrabold mt-1 text-xs sm:text-sm"
                    style={{ color: colors.muted }}
                >
                    Monte seus próprios quizes e jogue com seus amigos na arena.
                </p>
            </div>
        </div>
    );
};

export default WelcomeBanner;
