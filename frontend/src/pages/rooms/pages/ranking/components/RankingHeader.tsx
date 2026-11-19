import React from "react";
import { BiTrophy } from "react-icons/bi";
import { useTheme } from "../../../../../contexts/ThemeContext";

const RankingHeader: React.FC = () => {
    const { colors } = useTheme();

    return (
        <>
            <div className="flex justify-center">
                <div
                    className="
                        inline-flex items-center gap-2
                        font-black px-5 py-2
                        rounded-2xl text-sm sm:text-base
                        uppercase tracking-wider
                        border-2 border-b-4 shadow-sm
                    "
                    style={{
                        backgroundColor: `${colors.primary}25`,
                        color: colors.primary,
                        borderColor: colors.primary,
                    }}
                >
                    <BiTrophy className="w-6 h-6" />
                    <span>Placar da Rodada</span>
                </div>
            </div>

            <div className="text-center">
                <h1
                    className="
                        text-3xl sm:text-2xl
                        font-black tracking-tight
                    "
                    style={{ color: colors.text }}
                >
                    Ranking Parcial
                </h1>

                <p
                    className="
                        font-extrabold text-sm
                        sm:text-base mt-2
                    "
                    style={{ color: colors.muted }}
                >
                    Veja quem subiu e quem desceu na tabela!
                </p>
            </div>
        </>
    );
};

export default RankingHeader;