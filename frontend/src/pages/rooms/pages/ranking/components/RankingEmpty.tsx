import React from "react"
import { useTheme } from "../../../../../contexts/ThemeContext";

const RankingEmpty: React.FC = () => {
    const { colors } = useTheme();

    return (
        <div className="text-center py-12 space-y-4">
            <p
                className="font-black text-base"
                style={{ color: colors.muted }}
            >
                Nenhum jogador pontuou ainda.
            </p>
        </div>
    );
};

export default RankingEmpty;