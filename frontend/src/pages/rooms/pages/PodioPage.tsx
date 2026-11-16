
import React from "react";
import { Helmet } from "react-helmet-async";
import { BiCrown, BiMedal, BiTrophy } from "react-icons/bi";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
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
        navigate
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
                    px-4 py-5 sm:py-6
                    font-['Nunito',sans-serif]
                    select-none
                "
            >
                <div className="w-full max-w-xl relative z-10 space-y-6 my-auto shrink-0">

                    {/* Topo */}
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="
                                inline-flex items-center gap-2
                                border-2 border-b-4
                                font-black px-4 py-2.5
                                rounded-2xl text-xs sm:text-sm
                                tracking-wider uppercase
                                transition-all active:border-b-2
                                active:translate-y-0.5
                                cursor-pointer shadow-sm
                            "
                            style={{
                                ...surfaceStyle,
                                color: colors.muted
                            }}
                        >
                            <BsArrowLeft className="w-5 h-5" />
                            <span>Início</span>
                        </button>

                        <div
                            className="
                                inline-flex items-center gap-2
                                font-black px-4 py-2.5
                                rounded-2xl text-xs sm:text-sm
                                uppercase tracking-wider
                                border-2 border-b-4 shadow-sm
                            "
                            style={{
                                backgroundColor: `${colors.primary}25`,
                                color: colors.primary,
                                borderColor: colors.primary
                            }}
                        >
                            <BiTrophy className="w-5 h-5" />
                            <span>Pódio Final</span>
                        </div>
                    </div>

                    {/* Card principal */}
                    <section
                        className="
                            border-2 border-b-8
                            rounded-3xl p-6 sm:p-8
                            shadow-sm space-y-6 text-center
                        "
                        style={cardStyle}
                    >

                        <div>
                            <h1
                                className="
                                    text-2xl sm:text-3xl
                                    font-black tracking-tight
                                "
                                style={{ color: colors.text }}
                            >
                                Partida Finalizada! 🏆
                            </h1>

                            <p
                                className="
                                    font-extrabold text-xs
                                    sm:text-sm mt-1
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
                                    text-xs sm:text-sm
                                    font-black text-center
                                "
                                style={dangerStyle}
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div
                                    className="
                                        inline-block w-10 h-10
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
                                        font-black text-xs
                                        uppercase tracking-wider
                                    "
                                    style={mutedStyle}
                                >
                                    Calculando pódio final...
                                </p>
                            </div>
                        ) : topThree.length === 0 ? (
                            <div className="text-center py-8 space-y-4">
                                <p
                                    className="font-black"
                                    style={mutedStyle}
                                >
                                    Nenhum jogador pontuou na partida.
                                </p>
                            </div>
                        ) : (
                            <div
                                className="
                                    grid grid-cols-3 gap-3
                                    items-end pt-6 pb-2
                                    min-h-[260px]
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
                                            ? "min-h-[220px] sm:min-h-[250px]"
                                            : isSecond
                                                ? "min-h-[180px] sm:min-h-[210px]"
                                                : "min-h-[150px] sm:min-h-[180px]";

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
                                                                p-3 sm:p-5
                                                                rounded-3xl
                                                                border-2 border-b-8
                                                                text-center
                                                                transition-all
                                                                ${podiumHeight}
                                                                ${isFirst
                                                                    ? "shadow-lg z-10 -translate-y-2"
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
                                                                    w-12 h-12
                                                                    shrink-0
                                                                    rounded-2xl
                                                                    flex items-center
                                                                    justify-center
                                                                    font-black
                                                                    shadow-sm
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
                                                                            w-7 h-7
                                                                            ${isFirst ? "animate-bounce" : ""}
                                                                        `}
                                                                    />
                                                                ) : (
                                                                    <BiMedal className="w-6 h-6" />
                                                                )}
                                                            </div>

                                                            {/* Informações do jogador */}
                                                            <div className="w-full space-y-1 my-auto">
                                                                <span
                                                                    className="
                                                                        block font-black
                                                                        text-xs sm:text-sm
                                                                        uppercase tracking-wider
                                                                    "
                                                                    style={mutedStyle}
                                                                >
                                                                    {originalIndex + 1}º Lugar
                                                                </span>

                                                                <span
                                                                    className="
                                                                        block font-black
                                                                        text-sm sm:text-lg
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
                                                                    py-1.5 px-2 sm:px-3
                                                                    w-full shadow-sm
                                                                "
                                                                style={surfaceStyle}
                                                            >
                                                                <span
                                                                    className="
                                                                        text-xs sm:text-sm
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
                                    py-4 rounded-2xl
                                    flex items-center justify-center
                                    gap-3 text-lg uppercase
                                    tracking-wider cursor-pointer
                                    transition-all shadow-sm
                                "
                                style={{
                                    backgroundColor: colors.success,
                                    borderColor: `${colors.success}CC`
                                }}
                            >
                                <span>Encerrar Partida</span>
                                <BsArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default PodioPage;
