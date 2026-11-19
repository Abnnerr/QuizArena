
import { AnimatePresence, motion } from "framer-motion";
import { BiCrown, BiMedal } from "react-icons/bi";
import type {
    PodiumComponentProps,
    PodiumPlayerData,
} from "../types/types";

interface PodiumPlayerProps extends PodiumComponentProps {
    player: PodiumPlayerData;
    originalIndex: number;
    visible: boolean;
}

export function PodiumPlayer({
    colors,
    player,
    originalIndex,
    visible,
}: PodiumPlayerProps) {
    const isFirst = originalIndex === 0;
    const isSecond = originalIndex === 1;

    const medalStyle = isFirst
        ? {
            background: `${colors.primary}20`,
            border: colors.primary,
            icon: colors.primary,
            iconBorder: `${colors.primary}CC`,
            iconText: "#7A5B00",
        }
        : isSecond
            ? {
                background: "#1CB0F618",
                border: "#1CB0F6",
                icon: "#1CB0F6",
                iconBorder: "#0092D6",
                iconText: "#FFFFFF",
            }
            : {
                background: "#D89E0018",
                border: "#D89E00",
                icon: "#D89E00",
                iconBorder: "#B88F00",
                iconText: "#FFFFFF",
            };

    const podiumHeight = isFirst
        ? "min-h-[185px] sm:min-h-[215px] lg:min-h-[245px]"
        : isSecond
            ? "min-h-[155px] sm:min-h-[180px] lg:min-h-[205px]"
            : "min-h-[130px] sm:min-h-[150px] lg:min-h-[175px]";

    const playerName =
        player.players?.player_name ??
        player.player_name ??
        "Participante";

    return (
        <div className="flex flex-col justify-end h-full min-w-0">
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 45,
                            scale: 0.85,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                        }}
                        transition={{
                            type: "spring",
                            stiffness: 220,
                            damping: 18,
                        }}
                        className={`
                            flex flex-col
                            items-center
                            justify-between
                            p-2 sm:p-3
                            rounded-2xl
                            border-2 border-b-4
                            text-center
                            ${podiumHeight}
                            ${isFirst ? "shadow-lg z-10" : ""}
                        `}
                        style={{
                            backgroundColor: medalStyle.background,
                            borderColor: medalStyle.border,
                        }}
                    >
                        {/* Medalha */}
                        <div
                            className="
                                w-10 h-10
                                sm:w-14 sm:h-14
                                shrink-0 rounded-xl
                                flex items-center justify-center
                                font-black shadow-sm
                                border-2 border-b-4
                            "
                            style={{
                                backgroundColor: medalStyle.icon,
                                borderColor: medalStyle.iconBorder,
                                color: medalStyle.iconText,
                            }}
                        >
                            {isFirst ? (
                                <BiCrown
                                    className="
                                        w-7 h-7
                                        sm:w-9 sm:h-9
                                        animate-bounce
                                    "
                                />
                            ) : (
                                <BiMedal
                                    className="
                                        w-6 h-6
                                        sm:w-8 sm:h-8
                                    "
                                />
                            )}
                        </div>

                        {/* Informações do jogador */}
                        <div className="w-full space-y-1 my-auto py-2 min-w-0">
                            <span
                                className="
                                    block font-black
                                    text-[10px] sm:text-xs
                                    uppercase tracking-wider
                                "
                                style={{ color: colors.muted }}
                            >
                                {originalIndex + 1}º Lugar
                            </span>

                            <span
                                className="
                                    block font-black
                                    text-xs sm:text-base lg:text-lg
                                    truncate w-full px-1
                                "
                                style={{ color: colors.text }}
                                title={playerName}
                            >
                                {playerName}
                            </span>
                        </div>

                        {/* Pontuação */}
                        <div
                            className="
                                border-2 rounded-lg
                                py-1.5 sm:py-2
                                px-1 sm:px-3
                                w-full shadow-sm
                            "
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }}
                        >
                            <span
                                className="
                                    text-xs sm:text-base
                                    font-black
                                "
                                style={{ color: colors.muted }}
                            >
                                {player.score} pts
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
