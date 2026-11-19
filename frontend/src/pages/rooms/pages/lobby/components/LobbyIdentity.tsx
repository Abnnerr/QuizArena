
import {
    BiCrown,
    BiCheck,
    BiCopy,
} from "react-icons/bi";
import type { LobbyIdentityProps } from "../types/types";


const HOST_COLOR = "#F5C542";

export function LobbyIdentity({
    colors,
    isHost,
    roomCode,
    playerName,
    copied,
    onCopyCode,
}: LobbyIdentityProps) {
    const cardStyle: React.CSSProperties = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const hostStyle: React.CSSProperties = {
        backgroundColor: HOST_COLOR,
        borderColor: "#C69B00",
        color: "#7A5B00",
    };

    const playerStyle: React.CSSProperties = {
        backgroundColor: "#1CB0F6",
        borderColor: "#0092D6",
        color: "#FFFFFF",
    };

    if (!isHost) {
        return (
            <section
                className="
                    border-2 border-b-8 rounded-3xl
                    p-5 sm:p-6 shadow-lg
                "
                style={cardStyle}
            >
                <div className="flex items-center gap-3">
                    <div
                        className="
                            w-14 h-14 shrink-0
                            rounded-2xl border-b-4
                            flex items-center justify-center
                            text-xl font-black uppercase
                        "
                        style={playerStyle}
                    >
                        {playerName?.trim().charAt(0) || "?"}
                    </div>

                    <div className="min-w-0">
                        <span
                            className="
                                block text-xs font-black
                                uppercase tracking-wider
                            "
                            style={{ color: "#1CB0F6" }}
                        >
                            Você entrou como
                        </span>

                        <span
                            className="
                                block font-black text-lg truncate
                            "
                            style={{ color: colors.text }}
                        >
                            {playerName || "Jogador"}
                        </span>

                        <span
                            className="text-[11px] font-bold"
                            style={{ color: colors.muted }}
                        >
                            Participante da partida
                        </span>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section
            className="
                border-2 border-b-8 rounded-3xl
                p-5 sm:p-6 shadow-lg
            "
            style={cardStyle}
        >
            <div className="flex items-center gap-3 mb-5">
                <div
                    className="
                        w-10 h-10 rounded-xl
                        border-b-4 flex items-center
                        justify-center
                    "
                    style={hostStyle}
                >
                    <BiCrown className="w-6 h-6" />
                </div>

                <div>
                    <h2
                        className="
                            text-sm font-black
                            uppercase tracking-wider
                        "
                        style={{ color: colors.text }}
                    >
                        Código da sala
                    </h2>

                    <p
                        className="text-[11px] font-bold"
                        style={{ color: colors.muted }}
                    >
                        Compartilhe com seus amigos
                    </p>
                </div>
            </div>

            <div
                className="
                    border-2 border-b-4 rounded-2xl
                    p-5 text-center mb-4
                "
                style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                }}
            >
                <span
                    className="
                        text-3xl sm:text-4xl
                        font-black tracking-[0.2em]
                        break-all
                    "
                    style={{ color: colors.primary }}
                >
                    {roomCode || "------"}
                </span>
            </div>

            <button
                type="button"
                onClick={onCopyCode}
                className="
                    w-full inline-flex items-center
                    h-15
                    justify-center gap-2
                    border-b-4 font-black px-5 py-3.5
                    rounded-2xl text-xs uppercase
                    tracking-wider active:translate-y-1
                    active:border-b-0 transition-all shadow-sm
                "
                style={{
                    backgroundColor: colors.primary,
                    borderColor: colors.primary,
                    color: "#FFFFFF",
                }}
            >
                {copied
                    ? <BiCheck className="w-5 h-5" />
                    : <BiCopy className="w-5 h-5" />
                }

                {copied ? "Código copiado!" : "Copiar código"}
            </button>
        </section>
    );
}
