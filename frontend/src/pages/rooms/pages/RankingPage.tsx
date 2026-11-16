
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import {
    BsArrowLeft,
    BsArrowRight,
    BsArrowUpShort,
    BsArrowDownShort,
    BsDash
} from "react-icons/bs";
import { BiTrophy } from "react-icons/bi";
import { AXIOS } from "../../../service";
import { useTheme } from "../../../contexts/ThemeContext";

interface PlayerData {
    player_id: string | number;
    player_name: string;
    score: number;
}

interface RankingWithDiff extends PlayerData {
    currentPos: number;
    prevPos: number;
    diff: number;
}

const RankingPage: React.FC = () => {
    const navigate = useNavigate();
    const { roomCode, round } = useParams<{
        roomCode: string;
        round: string;
    }>();

    const { colors } = useTheme();

    const [rankingList, setRankingList] = useState<RankingWithDiff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    async function createNewRound() {
        if (!roomCode || !round) return;

        try {
            const { data } = await AXIOS.post(
                `/round/${roomCode}/roundFinished`,
                {
                    round_id: Number(round)
                }
            );

            if (data.type === "Success") {
                navigate(-1);
            }
        } catch (err) {
            console.error("Erro ao avançar a rodada:", err);
            setError("Não foi possível avançar a rodada.");
        }
    }

    useEffect(() => {
        let active = true;
        let animationTimeout: ReturnType<typeof setTimeout>;

        async function fetchPodium() {
            try {
                const { data } = await AXIOS.get(
                    `/player/${roomCode}/podium`
                );

                const currentData = data?.data;

                if (!Array.isArray(currentData)) {
                    throw new Error("Formato de ranking inválido.");
                }

                const currentPlayers: PlayerData[] = currentData.map(
                    (item: any) => ({
                        player_id: item.player_id,
                        player_name: item.players.player_name,
                        score: item.score
                    })
                );

                const savedPodium = sessionStorage.getItem("podium");
                let previousData: PlayerData[] = [];

                if (savedPodium) {
                    try {
                        const parsed = JSON.parse(savedPodium);
                        previousData = Array.isArray(parsed) ? parsed : [];
                    } catch {
                        previousData = [];
                    }
                }

                const baselineData =
                    previousData.length > 0
                        ? previousData
                        : currentPlayers;

                const processedRanking: RankingWithDiff[] =
                    currentPlayers.map((player, index) => {
                        const currentPos = index + 1;

                        const previousIndex = baselineData.findIndex(
                            prev => prev.player_id === player.player_id
                        );

                        const prevPos =
                            previousIndex !== -1
                                ? previousIndex + 1
                                : currentPos;

                        return {
                            ...player,
                            currentPos,
                            prevPos,
                            diff: prevPos - currentPos
                        };
                    });

                if (!active) return;

                const sortedList = processedRanking.sort(
                    (a, b) => a.currentPos - b.currentPos
                );

                setRankingList(sortedList);
                setLoading(false);

                sessionStorage.setItem(
                    "podium",
                    JSON.stringify(currentPlayers)
                );

                animationTimeout = setTimeout(() => {
                    if (active) {
                        setAnimateTrigger(true);
                    }
                }, 200);

            } catch (err) {
                console.error("Erro ao carregar o ranking:", err);

                if (active) {
                    setError("Não foi possível carregar o ranking.");
                    setLoading(false);
                }
            }
        }

        if (!roomCode) {
            setError("Código da sala não encontrado.");
            setLoading(false);

            return () => {
                active = false;
            };
        }

        void fetchPodium();

        return () => {
            active = false;
            clearTimeout(animationTimeout);
        };

    }, [roomCode]);

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

    const successStyle = {
        color: colors.success,
        backgroundColor: `${colors.success}18`,
        borderColor: colors.success
    };

    const dangerStyle = {
        color: colors.danger,
        backgroundColor: `${colors.danger}18`,
        borderColor: colors.danger
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Classificação da Rodada</title>
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
                            onClick={() => navigate(-1)}
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
                            <span>Voltar</span>
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
                            <span>Placar da Rodada</span>
                        </div>
                    </div>

                    {/* Card principal */}
                    <section
                        className="
                            border-2 border-b-8
                            rounded-3xl p-6 sm:p-8
                            shadow-sm space-y-6
                        "
                        style={cardStyle}
                    >

                        <div className="text-center">
                            <h1
                                className="text-xl sm:text-2xl font-black tracking-tight"
                                style={{ color: colors.text }}
                            >
                                Ranking Parcial
                            </h1>

                            <p
                                className="font-extrabold text-xs sm:text-sm mt-1"
                                style={mutedStyle}
                            >
                                Veja quem subiu e quem desceu na tabela!
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
                                    Calculando posições...
                                </p>
                            </div>
                        ) : rankingList.length === 0 ? (
                            <div className="text-center py-8 space-y-4">
                                <p
                                    className="font-black"
                                    style={mutedStyle}
                                >
                                    Nenhum jogador pontuou ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                {rankingList.map((player) => {
                                    const hasMovedUp = player.diff > 0;
                                    const hasMovedDown = player.diff < 0;

                                    const offsetY = animateTrigger
                                        ? 0
                                        : (player.prevPos - player.currentPos) * 72;

                                    const movementStyle = animateTrigger && hasMovedUp
                                        ? successStyle
                                        : animateTrigger && hasMovedDown
                                            ? dangerStyle
                                            : surfaceStyle;

                                    return (
                                        <motion.div
                                            key={player.player_id}
                                            initial={{
                                                y: offsetY,
                                                opacity: 0
                                            }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                backgroundColor:
                                                    animateTrigger && hasMovedUp
                                                        ? `${colors.success}18`
                                                        : animateTrigger && hasMovedDown
                                                            ? `${colors.danger}18`
                                                            : colors.surface
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 70,
                                                damping: 14,
                                                opacity: {
                                                    duration: 0.3
                                                }
                                            }}
                                            className="
                                                border-2 border-b-4
                                                rounded-2xl p-3.5
                                                flex items-center justify-between
                                                shadow-sm transition-colors
                                            "
                                            style={{
                                                borderColor:
                                                    animateTrigger && hasMovedUp
                                                        ? colors.success
                                                        : animateTrigger && hasMovedDown
                                                            ? colors.danger
                                                            : colors.border
                                            }}
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <span
                                                    className="
                                                        w-8 h-8 shrink-0
                                                        rounded-xl flex items-center
                                                        justify-center text-xs
                                                        font-black border-b-2
                                                    "
                                                    style={{
                                                        backgroundColor:
                                                            player.currentPos === 1
                                                                ? colors.primary
                                                                : player.currentPos === 2
                                                                    ? "#1CB0F6"
                                                                    : player.currentPos === 3
                                                                        ? "#D89E00"
                                                                        : colors.surface,
                                                        borderColor:
                                                            player.currentPos === 1
                                                                ? colors.primary
                                                                : player.currentPos === 2
                                                                    ? "#0092D6"
                                                                    : player.currentPos === 3
                                                                        ? "#B88F00"
                                                                        : colors.border,
                                                        color:
                                                            player.currentPos <= 3
                                                                ? "#FFFFFF"
                                                                : colors.muted
                                                    }}
                                                >
                                                    {player.currentPos}º
                                                </span>

                                                <span
                                                    className="
                                                        font-black text-sm
                                                        sm:text-base truncate
                                                    "
                                                    style={{ color: colors.text }}
                                                >
                                                    {player.player_name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4 shrink-0">
                                                <div className="flex items-center min-w-[65px] justify-end">
                                                    {hasMovedUp ? (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{
                                                                scale: animateTrigger ? 1 : 0
                                                            }}
                                                            className="
                                                                inline-flex items-center gap-0.5
                                                                px-2 py-1 rounded-xl
                                                                text-xs font-black
                                                                border-2 border-b-4
                                                            "
                                                            style={successStyle}
                                                        >
                                                            <BsArrowUpShort className="w-4 h-4 stroke-[2]" />
                                                            <span>+{player.diff}</span>
                                                        </motion.span>
                                                    ) : hasMovedDown ? (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{
                                                                scale: animateTrigger ? 1 : 0
                                                            }}
                                                            className="
                                                                inline-flex items-center gap-0.5
                                                                px-2 py-1 rounded-xl
                                                                text-xs font-black
                                                                border-2 border-b-4
                                                            "
                                                            style={dangerStyle}
                                                        >
                                                            <BsArrowDownShort className="w-4 h-4 stroke-[2]" />
                                                            <span>{player.diff}</span>
                                                        </motion.span>
                                                    ) : (
                                                        <span
                                                            className="px-2 py-1"
                                                            style={mutedStyle}
                                                        >
                                                            <BsDash className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </div>

                                                <span
                                                    className="
                                                        text-xs sm:text-sm
                                                        font-black min-w-[55px]
                                                        text-right
                                                    "
                                                    style={{ color: colors.muted }}
                                                >
                                                    {player.score} pts
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Botão de avançar */}
                        <div className="pt-2">
                            <button
                                onClick={createNewRound}
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
                                <span>Avançar Partida</span>
                                <BsArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default RankingPage;
