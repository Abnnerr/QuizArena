import React from "react";
import { motion } from "framer-motion";
import {
    BsArrowUpShort,
    BsArrowDownShort,
    BsDash,
} from "react-icons/bs";
import { useTheme } from "../../../../../contexts/ThemeContext";
import type { RankingPlayerCardProps } from "../types/types";



const RankingPlayerCard: React.FC<RankingPlayerCardProps> = ({
    player,
    animateTrigger,
}) => {
    const { colors } = useTheme();

    const hasMovedUp = player.diff > 0;
    const hasMovedDown = player.diff < 0;

    const displayedPosition = animateTrigger
        ? player.currentPos
        : player.prevPos;

    const positionBackground =
        displayedPosition === 1
            ? colors.primary
            : displayedPosition === 2
                ? "#1CB0F6"
                : displayedPosition === 3
                    ? "#D89E00"
                    : colors.surface;

    const positionBorder =
        displayedPosition === 1
            ? colors.primary
            : displayedPosition === 2
                ? "#0092D6"
                : displayedPosition === 3
                    ? "#B88F00"
                    : colors.border;

    const movementStyle = hasMovedUp
        ? {
            color: colors.success,
            backgroundColor: `${colors.success}18`,
            borderColor: colors.success,
        }
        : {
            color: colors.danger,
            backgroundColor: `${colors.danger}18`,
            borderColor: colors.danger,
        };

    return (
        <motion.div
            layout="position"
            initial={false}
            animate={{
                backgroundColor:
                    animateTrigger && hasMovedUp
                        ? `${colors.success}18`
                        : animateTrigger && hasMovedDown
                            ? `${colors.danger}18`
                            : colors.surface,
            }}
            transition={{
                layout: {
                    type: "spring",
                    stiffness: 70,
                    damping: 16,
                    mass: 1,
                },
                backgroundColor: {
                    duration: 0.4,
                },
            }}
            className="
                border-2 border-b-4
                rounded-2xl
                p-4 sm:p-5 lg:px-6 lg:py-3
                flex items-center justify-between
                gap-3 shadow-sm
            "
            style={{
                borderColor:
                    animateTrigger && hasMovedUp
                        ? colors.success
                        : animateTrigger && hasMovedDown
                            ? colors.danger
                            : colors.border,
            }}
        >
            {/* Jogador e posição */}
            <div className="
                flex items-center gap-3
                sm:gap-5 min-w-0
            ">
                <motion.span
                    key={displayedPosition}
                    initial={{
                        scale: animateTrigger ? 0.7 : 1,
                    }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 15,
                    }}
                    className="
                        w-11 h-11 sm:w-14 sm:h-14
                        shrink-0 rounded-xl
                        flex items-center justify-center
                        text-sm sm:text-base
                        font-black border-b-4
                    "
                    style={{
                        backgroundColor: positionBackground,
                        borderColor: positionBorder,
                        color:
                            displayedPosition <= 3
                                ? "#FFFFFF"
                                : colors.muted,
                    }}
                >
                    {displayedPosition}º
                </motion.span>

                <span
                    className="
                        font-black
                        text-base sm:text-xl
                        lg:text-2xl truncate
                    "
                    style={{ color: colors.text }}
                >
                    {player.player_name}
                </span>
            </div>

            {/* Variação e pontuação */}
            <div className="
                flex items-center gap-2
                sm:gap-5 shrink-0
            ">
                <div className="
                    flex items-center
                    min-w-[55px] sm:min-w-[85px]
                    justify-end
                ">
                    {hasMovedUp ? (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{
                                scale: animateTrigger ? 1 : 0,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 15,
                            }}
                            className="
                                inline-flex items-center gap-0.5
                                px-2 sm:px-3 py-1.5
                                rounded-xl text-xs sm:text-sm
                                font-black border-2 border-b-4
                            "
                            style={movementStyle}
                        >
                            <BsArrowUpShort className="w-5 h-5" />
                            <span>+{player.diff}</span>
                        </motion.span>
                    ) : hasMovedDown ? (
                        <motion.span
                            initial={{ scale: 0 }}
                            animate={{
                                scale: animateTrigger ? 1 : 0,
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 250,
                                damping: 15,
                            }}
                            className="
                                inline-flex items-center gap-0.5
                                px-2 sm:px-3 py-1.5
                                rounded-xl text-xs sm:text-sm
                                font-black border-2 border-b-4
                            "
                            style={movementStyle}
                        >
                            <BsArrowDownShort className="w-5 h-5" />
                            <span>{player.diff}</span>
                        </motion.span>
                    ) : (
                        <span
                            className="px-2 py-1"
                            style={{ color: colors.muted }}
                        >
                            <BsDash className="w-6 h-6" />
                        </span>
                    )}
                </div>

                <span
                    className="
                        text-sm sm:text-base lg:text-lg
                        font-black min-w-[65px]
                        sm:min-w-[90px] text-right
                    "
                    style={{ color: colors.muted }}
                >
                    {player.score} pts
                </span>
            </div>
        </motion.div>
    );
};

export default RankingPlayerCard;