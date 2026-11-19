import type { LobbyComponentProps } from "../types/types";



interface LobbyBannerProps extends LobbyComponentProps {
    loading: boolean;
    roomName?: string;
    isHost: boolean;
}

export function LobbyBanner({
    colors,
    loading,
    roomName,
    isHost,
}: LobbyBannerProps) {
    const cardStyle: React.CSSProperties = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    return (
        <section className="flex flex-col sm:flex-row items-center gap-4">
            <div
                className="
                    w-20 h-20 sm:w-24 sm:h-24 shrink-0
                    rounded-3xl border-2 border-b-8
                    p-2.5 shadow-lg flex items-center
                    justify-center
                "
                style={cardStyle}
            >
                <img
                    src="/favicon-quiz.png"
                    alt="QuizArena"
                    className="h-full w-full object-contain drop-shadow"
                />
            </div>

            <div
                className="
                    relative border-2 border-b-4
                    rounded-2xl p-4 sm:p-5 text-center
                    sm:text-left shadow-lg w-full min-w-0
                "
                style={cardStyle}
            >
                <div
                    className="
                        hidden sm:block absolute -left-3
                        top-1/2 -translate-y-1/2
                        w-0 h-0 border-y-8
                        border-y-transparent border-r-8
                    "
                    style={{ borderRightColor: colors.border }}
                />

                <div
                    className="
                        hidden sm:block absolute -left-2
                        top-1/2 -translate-y-1/2
                        w-0 h-0 border-y-6
                        border-y-transparent border-r-6
                    "
                    style={{ borderRightColor: colors.card }}
                />

                <span
                    className="
                        block text-[9px] font-black uppercase
                        tracking-widest mb-1.5
                    "
                    style={{ color: colors.muted }}
                >
                    Aguardando jogadores
                </span>

                <h1
                    className="
                        text-xl sm:text-2xl font-black
                        tracking-tight break-words
                    "
                    style={{ color: colors.text }}
                >
                    {loading
                        ? "Carregando arena..."
                        : roomName || "Sala de espera"
                    }
                </h1>

                <p
                    className="
                        font-extrabold text-xs sm:text-sm
                        mt-1 leading-relaxed
                    "
                    style={{ color: colors.muted }}
                >
                    {isHost
                        ? "Gerencie os participantes e inicie a partida quando todos estiverem prontos!"
                        : "Você está dentro! Prepare-se e marque 'Estou pronto'."
                    }
                </p>
            </div>
        </section>
    );
}
