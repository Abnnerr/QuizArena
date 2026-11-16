
import React from "react";
import { Helmet } from "react-helmet-async";
import { BiCrown, BiMedal, BiTrophy } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import usePodio from "../hooks/usePodio";
import { useTheme } from "../../../contexts/ThemeContext";

const PodioPage: React.FC = () => {
    const {
        orderedPodium,
        error,
        visibleCount,
        loading,
        topThree,
        clearRoom,
    } = usePodio();

    const { colors } = useTheme();

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border
    };

    const surfaceStyle = {
        backgroundColor: colors.surface,
        borderColor: colors.border
    };

    const mutedStyle = {
        color: colors.muted
    };

    const dangerStyle = {
        color: colors.danger,
        backgroundColor: `${colors.danger}18`,
        borderColor: colors.danger
    };

    const podiumColors = {
        first: {
            background: `${colors.primary}20`,
            border: colors.primary,
            icon: colors.primary,
            iconBorder: `${colors.primary}CC`,
            iconText: "#7A5B00"
        },
        second: {
            background: "#1CB0F618",
            border: "#1CB0F6",
            icon: "#1CB0F6",
            iconBorder: "#0092D6",
            iconText: "#FFFFFF"
        },
        third: {
            background: "#D89E0018",
            border: "#D89E00",
            icon: "#D89E00",
            iconBorder: "#B88F00",
            iconText: "#FFFFFF"
        }
    };

    return (

        <>
            <Helmet>
                <title>QuizArena • Fim de Partida • Pódio Final</title>
            </Helmet>

            <div
                className="
            w-full flex-1 min-h-0
            flex flex-col items-center
            overflow-y-auto overflow-x-hidden
            px-4 py-6 sm:px-6 sm:py-8
            font-['Nunito',sans-serif]
            select-none
        "
            >
                <div className="w-full max-w-4xl relative z-10 space-y-8 my-auto shrink-0">

                    {/* Topo */}
                    <div className="flex justify-center">
                        <div
                            className="
                        inline-flex items-center gap-2
                        font-black px-5 py-3
                        rounded-2xl text-sm sm:text-base
                        uppercase tracking-wider
                        border-2 border-b-4 shadow-sm
                    "
                            style={{
                                backgroundColor: `${colors.primary}25`,
                                color: colors.primary,
                                borderColor: colors.primary
                            }}
                        >
                            <BiTrophy className="w-6 h-6" />
                            <span>Pódio Final</span>
                        </div>
                    </div>

                    {/* Card principal */}
                    <section
                        className="
                    border-2 border-b-8
                    rounded-3xl p-6 sm:p-10 lg:p-12
                    shadow-sm space-y-8 text-center
                "
                        style={cardStyle}
                    >

                        <div>
                            <h1
                                className="
                            text-3xl sm:text-4xl lg:text-5xl
                            font-black tracking-tight
                        "
                                style={{ color: colors.text }}
                            >
                                Partida Finalizada!
                            </h1>

                            <p
                                className="
                            font-extrabold text-sm
                            sm:text-base mt-2
                        "
                                style={mutedStyle}
                            >
                                Revelando os grandes campeões da arena...
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="
                            border-2 border-b-4
                            p-4 rounded-2xl
                            text-sm sm:text-base
                            font-black text-center
                        "
                                style={dangerStyle}
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-16 space-y-4">
                                <div
                                    className="
                                inline-block w-14 h-14
                                border-4 border-t-transparent
                                rounded-full animate-spin
                            "
                                    style={{
                                        borderColor: colors.primary,
                                        borderTopColor: "transparent"
                                    }}
                                />

                                <p
                                    className="
                                font-black text-sm
                                uppercase tracking-wider
                            "
                                    style={mutedStyle}
                                >
                                    Calculando pódio final...
                                </p>
                            </div>
                        ) : topThree.length === 0 ? (
                            <div className="text-center py-12 space-y-4">
                                <p
                                    className="font-black text-base"
                                    style={mutedStyle}
                                >
                                    Nenhum jogador pontuou na partida.
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                            grid grid-cols-3 gap-3 sm:gap-6
                            items-end pt-8 pb-4
                            min-h-[340px] sm:min-h-[430px]
                        "
                            >
                                {orderedPodium.map(
                                    ({ player, originalIndex }: any) => {
                                        const isFirst = originalIndex === 0;
                                        const isSecond = originalIndex === 1;
                                        const isThird = originalIndex === 2;

                                        const revealOrder = isThird
                                            ? 1
                                            : isSecond
                                                ? 2
                                                : 3;

                                        const isVisible =
                                            visibleCount >= revealOrder;

                                        const playerName =
                                            player.players?.player_name ??
                                            player.player_name ??
                                            "Participante";

                                        const medalStyle = isFirst
                                            ? podiumColors.first
                                            : isSecond
                                                ? podiumColors.second
                                                : podiumColors.third;

                                        const podiumHeight = isFirst
                                            ? "min-h-[280px] sm:min-h-[340px] lg:min-h-[380px]"
                                            : isSecond
                                                ? "min-h-[230px] sm:min-h-[280px] lg:min-h-[310px]"
                                                : "min-h-[190px] sm:min-h-[230px] lg:min-h-[260px]";

                                        return (
                                            <div
                                                key={player.player_id}
                                                className="flex flex-col justify-end h-full"
                                            >
                                                <AnimatePresence>
                                                    {isVisible && (
                                                        <motion.div
                                                            initial={{
                                                                opacity: 0,
                                                                y: 70,
                                                                scale: 0.8
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                y: 0,
                                                                scale: 1
                                                            }}
                                                            transition={{
                                                                type: "spring",
                                                                stiffness: 260,
                                                                damping: 16
                                                            }}
                                                            className={`
                                                        flex flex-col
                                                        items-center
                                                        justify-between
                                                        p-3 sm:p-5 lg:p-6
                                                        rounded-3xl
                                                        border-2 border-b-8
                                                        text-center
                                                        transition-all
                                                        ${podiumHeight}
                                                        ${isFirst
                                                                    ? "shadow-lg z-10 -translate-y-3"
                                                                    : ""
                                                                }
                                                    `}
                                                            style={{
                                                                backgroundColor: medalStyle.background,
                                                                borderColor: medalStyle.border
                                                            }}
                                                        >

                                                            {/* Medalha */}
                                                            <div
                                                                className="
                                                            w-14 h-14 sm:w-20 sm:h-20
                                                            shrink-0 rounded-2xl
                                                            flex items-center
                                                            justify-center
                                                            font-black shadow-sm
                                                            border-2 border-b-4
                                                        "
                                                                style={{
                                                                    backgroundColor: medalStyle.icon,
                                                                    borderColor: medalStyle.iconBorder,
                                                                    color: medalStyle.iconText
                                                                }}
                                                            >
                                                                {isFirst ? (
                                                                    <BiCrown
                                                                        className={`
                                                                    w-9 h-9 sm:w-12 sm:h-12
                                                                    ${isFirst ? "animate-bounce" : ""}
                                                                `}
                                                                    />
                                                                ) : (
                                                                    <BiMedal className="w-8 h-8 sm:w-11 sm:h-11" />
                                                                )}
                                                            </div>

                                                            {/* Informações do jogador */}
                                                            <div className="w-full space-y-2 my-auto py-3">
                                                                <span
                                                                    className="
                                                                block font-black
                                                                text-xs sm:text-base
                                                                uppercase tracking-wider
                                                            "
                                                                    style={mutedStyle}
                                                                >
                                                                    {originalIndex + 1}º Lugar
                                                                </span>

                                                                <span
                                                                    className="
                                                                block font-black
                                                                text-sm sm:text-xl lg:text-2xl
                                                                truncate w-full px-1
                                                            "
                                                                    style={{ color: colors.text }}
                                                                >
                                                                    {playerName}
                                                                </span>
                                                            </div>

                                                            {/* Pontuação */}
                                                            <div
                                                                className="
                                                            border-2 rounded-xl
                                                            py-2 sm:py-3
                                                            px-2 sm:px-4
                                                            w-full shadow-sm
                                                        "
                                                                style={surfaceStyle}
                                                            >
                                                                <span
                                                                    className="
                                                                text-sm sm:text-lg
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
                                )}
                            </div>
                        )}

                        {/* Encerrar partida */}
                        <div className="pt-4">
                            <button
                                onClick={clearRoom}
                                className="
                            w-full border-b-4
                            active:border-b-0
                            active:translate-y-1
                            text-white font-black
                            py-5 sm:py-6 rounded-2xl
                            flex items-center justify-center
                            gap-3 text-base sm:text-xl uppercase
                            tracking-wider cursor-pointer
                            transition-all shadow-sm
                        "
                                style={{
                                    backgroundColor: colors.success,
                                    borderColor: `${colors.success}CC`
                                }}
                            >
                                <span>Encerrar Partida</span>
                                <BsArrowRight className="w-6 h-6 sm:w-7 sm:h-7" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PodioPage;
