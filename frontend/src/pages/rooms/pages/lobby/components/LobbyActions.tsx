
import { BsPlayFill, BsShieldCheck } from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import type { LobbyActionsProps } from "../types/types";


export function LobbyActions({
    colors,
    isHost,
    starting,
    ready,
    room,
    onStart,
    onToggleReady,
    onLeave,
}: LobbyActionsProps) {
    const cardStyle: React.CSSProperties = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    // const hostStyle: React.CSSProperties = {
    //     backgroundColor: "#F5C542",
    //     borderColor: "#C69B00",
    //     color: "#7A5B00",
    // };

    // const playerStyle: React.CSSProperties = {
    //     backgroundColor: "#1CB0F6",
    //     borderColor: "#0092D6",
    //     color: "#FFFFFF",
    // };

    const hasMinimumPlayers = room.players.length >= 2;
    const allPlayersReady = room.players.every((player) => player.ready);
    const canStart = hasMinimumPlayers && allPlayersReady;

    return (
        <section
            className="
                border-2 border-b-8 rounded-3xl
                p-5 sm:p-6 shadow-lg
            "
            style={cardStyle}
        >
            {isHost ? (
                <div className="space-y-4">
                    <div>
                        <h3
                            className="text-sm font-black"
                            style={{ color: colors.text }}
                        >
                            Tudo pronto?
                        </h3>

                        <p
                            className="
                                mt-1 text-xs font-bold
                                leading-relaxed
                            "
                            style={{ color: colors.muted }}
                        >
                            Inicie quando todos os participantes estiverem prontos.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onStart}
                        disabled={starting || !canStart}
                        title={
                            !hasMinimumPlayers
                                ? "São necessários pelo menos 2 jogadores."
                                : !allPlayersReady
                                    ? "Todos os jogadores precisam estar prontos."
                                    : undefined
                        }
                        className="
                            w-full border-b-4
                            active:border-b-0 active:translate-y-1
                            font-black py-4 rounded-2xl
                            flex items-center justify-center
                            gap-3 text-base uppercase
                            tracking-wider transition-all
                            shadow-md disabled:cursor-not-allowed
                            disabled:translate-y-0
                            disabled:border-b-4 disabled:opacity-50
                        "
                        style={{
                            backgroundColor: colors.success,
                            borderColor: colors.success,
                            color: "#FFFFFF",
                        }}
                    >
                        {starting ? "Iniciando..." : "Iniciar partida"}

                        <BsPlayFill className="w-7 h-7" />
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <button
                        type="button"
                        onClick={onToggleReady}
                        className="
                            w-full border-b-4 font-black
                            h-15
                            py-4 rounded-2xl active:border-b-0
                            active:translate-y-1 transition-all
                            flex items-center justify-center
                            gap-2 text-sm uppercase
                            tracking-wider shadow-md text-white
                        "
                        style={{
                            backgroundColor: ready
                                ? colors.danger
                                : colors.success,
                            borderColor: ready
                                ? colors.danger
                                : colors.success,
                        }}
                    >
                        <BsShieldCheck className="w-5 h-5" />

                        {ready
                            ? "Cancelar prontidão"
                            : "Estou pronto"
                        }
                    </button>

                    <button
                        type="button"
                        onClick={onLeave}
                        className="
                            w-full border-2 border-b-4
                            font-black py-3 rounded-2xl
                            active:border-b-2
                            h-10
                            active:translate-y-0.5
                            transition-all flex items-center
                            justify-center gap-2 text-xs
                            uppercase tracking-wider
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        Sair da sala
                    </button>
                </div>
            )}

            {!isHost && (
                <div className="flex items-center gap-2 mt-4">
                    <BiCrown
                        className="w-4 h-4"
                        style={{ color: colors.muted }}
                    />

                    <p
                        className="text-[11px] font-bold"
                        style={{ color: colors.muted }}
                    >
                        Somente o organizador pode iniciar a partida.
                    </p>
                </div>
            )}
        </section>
    );
}
