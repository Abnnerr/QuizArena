
import {
    BsArrowLeft,
    BsShieldCheck,
    BsVolumeMuteFill,
    BsVolumeUpFill,
} from "react-icons/bs";
import { BiCrown } from "react-icons/bi";
import type { LobbyComponentProps } from "../types/types";


interface LobbyHeaderProps extends LobbyComponentProps {
    isHost: boolean;
    isMuted: boolean;
    onBack: () => void;
    onToggleMute: () => void;
}

const HOST_COLOR = "#F5C542";

export function LobbyHeader({
    colors,
    isHost,
    isMuted,
    onBack,
    onToggleMute,
}: LobbyHeaderProps) {
    const cardStyle: React.CSSProperties = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const roleStyle: React.CSSProperties = isHost
        ? {
            backgroundColor: HOST_COLOR,
            borderColor: "#C69B00",
            color: "#7A5B00",
        }
        : {
            backgroundColor: "#1CB0F6",
            borderColor: "#0092D6",
            color: "#FFFFFF",
        };

    return (
        <header className="flex items-center justify-between gap-3">
            <button
                type="button"
                onClick={onBack}
                className="
                    inline-flex items-center gap-2
                    border-2 border-b-4 font-black
                    px-4 py-2.5 rounded-2xl text-xs
                    sm:text-sm tracking-wider uppercase
                    transition-all active:border-b-2
                    active:translate-y-0.5 shadow-sm
                "
                style={{
                    ...cardStyle,
                    color: colors.muted,
                }}
            >
                <BsArrowLeft className="w-5 h-5" />
                Voltar
            </button>

            <div className="flex items-center gap-2">
                <div
                    className="
                        hidden sm:inline-flex items-center
                        gap-2 font-black px-4 py-2.5
                        rounded-2xl text-xs tracking-wider
                        uppercase border-b-4
                    "
                    style={roleStyle}
                >
                    {isHost
                        ? <BiCrown className="w-5 h-5" />
                        : <BsShieldCheck className="w-5 h-5" />
                    }

                    {isHost ? "Organizador" : "Participante"}
                </div>

                <button
                    type="button"
                    onClick={onToggleMute}
                    title={isMuted ? "Ativar som" : "Mutar som"}
                    aria-label={isMuted ? "Ativar som" : "Mutar som"}
                    className="
                        border-2 border-b-4 p-2.5 sm:p-3
                        h-12
                        rounded-2xl transition-all
                        active:border-b-2 active:translate-y-0.5
                        shadow-sm flex items-center justify-center
                    "
                    style={cardStyle}
                >
                    {isMuted
                        ? (
                            <BsVolumeMuteFill
                                className="w-5 h-5"
                                style={{ color: colors.danger }}
                            />
                        )
                        : (
                            <BsVolumeUpFill
                                className="w-5 h-5"
                                style={{ color: colors.primary }}
                            />
                        )
                    }
                </button>
            </div>
        </header>
    );
}
