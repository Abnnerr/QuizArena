
import React from "react";
import {
    BsClockHistory,
    BsVolumeMuteFill,
    BsVolumeUpFill,
} from "react-icons/bs";

interface Props {
    isHost: boolean;
    timeLeft: number;
    isCriticalTime: boolean;
    isMusicMuted: boolean;
    onToggleMusic: () => void;
    colors: any;
}

const LiveHeader: React.FC<Props> = ({
    isHost,
    timeLeft,
    isCriticalTime,
    isMusicMuted,
    onToggleMusic,
    colors,
}) => {
    return (
        <header className="flex w-full flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
                {/* TÍTULO */}
                <div className="min-w-0">
                    <p
                        className="text-[9px] font-black uppercase tracking-[0.15em] sm:text-[10px]"
                        style={{ color: colors.muted }}
                    >
                        Quiz Arena
                    </p>

                    <h2
                        className="text-sm font-black tracking-tight sm:text-lg"
                        style={{ color: colors.text }}
                    >
                        Partida ao vivo
                    </h2>
                </div>

                {/* CONTROLES */}
                <div className="flex shrink-0 items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleMusic}
                        aria-label={
                            isMusicMuted
                                ? "Ligar música ambiente"
                                : "Desligar música ambiente"
                        }
                        className="
                    flex h-9 w-9 items-center justify-center
                    rounded-xl border-2 border-b-4
                    transition-all hover:brightness-110
                    active:translate-y-0.5 active:border-b-2
                    sm:h-10 sm:w-10
                "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.primary,
                        }}
                    >
                        {isMusicMuted ? (
                            <BsVolumeMuteFill className="h-4 w-4 sm:h-5 sm:w-5" />
                        ) : (
                            <BsVolumeUpFill className="h-4 w-4 sm:h-5 sm:w-5" />
                        )}
                    </button>

                    {isHost && (
                        <div
                            className="
                        flex h-9 items-center gap-1.5
                        rounded-xl border-2 border-b-4
                        px-2.5 sm:h-10 sm:px-3
                    "
                            style={{
                                backgroundColor: isCriticalTime
                                    ? `${colors.danger}20`
                                    : colors.card,
                                borderColor: isCriticalTime
                                    ? colors.danger
                                    : colors.primary,
                                color: isCriticalTime
                                    ? colors.danger
                                    : colors.primary,
                            }}
                        >
                            <BsClockHistory className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />

                            <span className="whitespace-nowrap text-xs font-black sm:text-base">
                                {timeLeft}s
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default LiveHeader;
