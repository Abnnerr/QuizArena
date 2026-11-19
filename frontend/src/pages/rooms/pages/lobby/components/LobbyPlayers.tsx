
import { BiCheck, BiUser } from "react-icons/bi";
import type { LobbyPlayersProps } from "../types/types";


export function LobbyPlayers({
    colors,
    players,
    maxPlayers,
}: LobbyPlayersProps) {
    const readyPlayers = players.filter((player: any) => player.ready).length;

    const progress = players.length > 0
        ? (readyPlayers / players.length) * 100
        : 0;

    const surfaceStyle: React.CSSProperties = {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    };

    const playerStyle: React.CSSProperties = {
        backgroundColor: "#1CB0F6",
        borderColor: "#0092D6",
        color: "#FFFFFF",
    };

    return (
        <section
            className="
                border-2 border-b-8 rounded-3xl
                p-5 sm:p-6 shadow-lg
            "
            style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
            }}
        >
            {/* Cabeçalho */}
            <div
                className="
                    flex flex-wrap items-center
                    justify-between gap-3 mb-5
                "
            >
                <div>
                    <h2
                        className="
                            text-sm font-black uppercase
                            tracking-widest flex items-center gap-2
                        "
                        style={{ color: colors.text }}
                    >
                        <BiUser
                            className="w-5 h-5"
                            style={{ color: "#1CB0F6" }}
                        />

                        Jogadores
                    </h2>

                    <p
                        className="text-[11px] font-bold mt-1"
                        style={{ color: colors.muted }}
                    >
                        Participantes da sala
                    </p>
                </div>

                <span
                    className="
                        text-xs font-black text-white
                        px-3 py-2 rounded-xl border-b-4
                    "
                    style={playerStyle}
                >
                    {players.length}/{maxPlayers}
                </span>
            </div>

            {/* Progresso */}
            <div
                className="border-2 rounded-2xl p-4 mb-5"
                style={surfaceStyle}
            >
                <div
                    className="
                        flex items-center justify-between
                        gap-2 mb-3
                    "
                >
                    <span
                        className="
                            text-[11px] font-black
                            uppercase tracking-wider
                        "
                        style={{ color: colors.muted }}
                    >
                        Prontidão dos jogadores
                    </span>

                    <span
                        className="text-xs font-black"
                        style={{ color: colors.success }}
                    >
                        {readyPlayers}/{players.length}
                    </span>
                </div>

                <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: colors.border }}
                >
                    <div
                        className="
                            h-full rounded-full
                            transition-all duration-500
                        "
                        style={{
                            width: `${progress}%`,
                            backgroundColor: colors.success,
                        }}
                    />
                </div>
            </div>

            {/* Lista */}
            <div className="mb-5">
                {players.length === 0 ? (
                    <div
                        className="
                            text-center py-10 rounded-2xl
                            border-2 border-dashed
                        "
                        style={surfaceStyle}
                    >
                        <BiUser
                            className="w-9 h-9 mx-auto mb-3"
                            style={{ color: colors.muted }}
                        />

                        <p
                            className="text-sm font-black"
                            style={{ color: colors.muted }}
                        >
                            Nenhum jogador ainda
                        </p>

                        <p
                            className="text-xs font-bold mt-1"
                            style={{ color: colors.muted }}
                        >
                            Compartilhe o código para convidar amigos.
                        </p>
                    </div>
                ) : (
                    <div
                        className="
                            grid grid-cols-1 sm:grid-cols-2
                            gap-3 max-h-[420px]
                            overflow-y-auto pr-1
                        "
                    >
                        {players.map((player: any) => (
                            <div
                                key={player.player_id}
                                className="
                                    border-2 border-b-4
                                    rounded-2xl p-3 flex
                                    items-center justify-between
                                    gap-2 transition-all
                                "
                                style={{
                                    backgroundColor: player.ready
                                        ? `${colors.success}18`
                                        : colors.surface,
                                    borderColor: player.ready
                                        ? colors.success
                                        : colors.border,
                                }}
                            >
                                <div
                                    className="
                                        flex items-center gap-3 min-w-0
                                    "
                                >
                                    <div
                                        className="
                                            w-10 h-10 shrink-0
                                            rounded-xl text-white
                                            flex items-center
                                            justify-center text-base
                                            font-black border-b-2
                                        "
                                        style={playerStyle}
                                    >
                                        {player.player_name
                                            ?.trim()
                                            .charAt(0)
                                            .toUpperCase() || "?"
                                        }
                                    </div>

                                    <div className="min-w-0">
                                        <span
                                            className="
                                                font-black text-sm
                                                block truncate
                                            "
                                            style={{ color: colors.text }}
                                        >
                                            {player.player_name}
                                        </span>

                                        <span
                                            className="
                                                block text-[11px]
                                                font-black
                                            "
                                            style={{
                                                color: player.ready
                                                    ? colors.success
                                                    : colors.muted,
                                            }}
                                        >
                                            {player.ready
                                                ? "● Pronto"
                                                : "○ Aguardando"
                                            }
                                        </span>
                                    </div>
                                </div>

                                {player.ready && (
                                    <div
                                        className="
                                            w-7 h-7 shrink-0
                                            rounded-full text-white
                                            flex items-center
                                            justify-center font-black
                                            border-b-2
                                        "
                                        style={{
                                            backgroundColor: colors.success,
                                            borderColor: colors.success,
                                        }}
                                    >
                                        <BiCheck className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Rodapé */}
            <div
                className="
                    border-t-2 pt-4 flex items-center
                    justify-between gap-2
                "
                style={{ borderColor: colors.border }}
            >
                <span
                    className="
                        text-xs font-black uppercase
                        tracking-wider
                    "
                    style={{ color: colors.muted }}
                >
                    Status da sala
                </span>

                <span
                    className="
                        flex items-center gap-2
                        text-[11px] font-black uppercase
                    "
                    style={{ color: colors.success }}
                >
                    Aguardando início
                </span>
            </div>
        </section>
    );
}
