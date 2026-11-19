
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
        <header className="flex w-full flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p
                        className="text-[10px] font-black uppercase tracking-[0.2em] sm:text-xs"
                        style={{ color: colors.muted }}
                    >
                        Quiz Arena
                    </p>

                    <h2
                        className="text-base font-black tracking-tight sm:text-xl"
                        style={{ color: colors.text }}
                    >
                        Partida ao vivo
                    </h2>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={onToggleMusic}
                        aria-label={
                            isMusicMuted
                                ? "Ligar música ambiente"
                                : "Desligar música ambiente"
                        }
                        className="
                            flex h-14 items-center justify-center gap-1.5
                            rounded-xl border-2 border-b-4 px-3 py-2
                            text-xs font-black transition-all
                            hover:brightness-110
                            active:translate-y-0.5 active:border-b-2
                            sm:px-4 sm:py-3 sm:text-sm
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.primary,
                        }}
                    >
                        {isMusicMuted ? (
                            <BsVolumeMuteFill className="h-5 w-5" />
                        ) : (
                            <BsVolumeUpFill className="h-5 w-5" />
                        )}
                    </button>

                    {isHost && (
                        <div
                            className="
                                flex items-center gap-2 rounded-xl
                                border-2 border-b-4 px-3 py-2
                                sm:px-5 sm:py-3
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
                            <BsClockHistory className="h-4 w-4 shrink-0 sm:h-5 sm:w-5" />

                            <span className="whitespace-nowrap text-sm font-black sm:text-xl">
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
