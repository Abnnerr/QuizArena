
import React from "react";

interface Props {
    isHost: boolean;
    answered: boolean;
    skip: boolean;
    timeLeft: number;
    colors: any;
    skipColor: string;
}

const LivePlayerStatus: React.FC<Props> = ({
    isHost,
    answered,
    skip,
    timeLeft,
    colors,
    skipColor,
}) => {
    if (isHost) return null;

    return (
        <div className="pb-1 text-center">
            {answered ? (
                <p
                    className="text-xs font-black uppercase tracking-wider sm:text-sm"
                    style={{ color: colors.success }}
                >
                    <span className="mr-1">✓</span>
                    Resposta enviada!
                </p>
            ) : skip ? (
                <p
                    className="text-xs font-black uppercase tracking-wider sm:text-sm"
                    style={{ color: skipColor }}
                >
                    Sua vez foi pulada nesta rodada
                </p>
            ) : timeLeft <= 0 ? (
                <p
                    className="text-xs font-black uppercase tracking-wider sm:text-sm"
                    style={{ color: colors.danger }}
                >
                    Tempo esgotado!
                </p>
            ) : (
                <p
                    className="text-xs font-bold sm:text-sm"
                    style={{ color: colors.muted }}
                >
                    Escolha uma alternativa para responder
                </p>
            )}
        </div>
    );
};

export default LivePlayerStatus;
