
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { motion } from "framer-motion";
import {
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
    oldScore: number
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

                const players: PlayerData[] = currentData.map(
                    (item: any) => ({
                        player_id: item.player_id,
                        player_name: item.players.player_name,
                        score: item.score,
                        oldScore: item.oldScore
                    })
                );

                console.log(players);
                
                // Reconstrói o ranking anterior usando oldScore.
                const previousRanking = [...players].sort(
                    (a, b) => b.oldScore - a.oldScore
                );

                // Ordena o ranking atual usando score.
                const currentRanking = [...players].sort(
                    (a, b) => b.score - a.score
                );

                // Guarda a posição anterior de cada jogador.
                const previousPositions = new Map(
                    previousRanking.map((player, index) => [
                        player.player_id,
                        index + 1
                    ])
                );

                // Calcula as posições e diferenças.
                const processedRanking: RankingWithDiff[] =
                    currentRanking.map((player, index) => {
                        const currentPos = index + 1;

                        const prevPos =
                            previousPositions.get(player.player_id) ??
                            currentPos;

                        return {
                            ...player,
                            currentPos,
                            prevPos,
                            diff: prevPos - currentPos
                        };
                    });

                if (!active) return;

                setRankingList(processedRanking);
                setLoading(false);

                // Aguarda a renderização inicial antes de iniciar a animação.
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
                    px-4 py-6 sm:px-6 sm:py-8
                    font-['Nunito',sans-serif]
                    select-none
                "
            >
                <div className="
                    w-full max-w-4xl relative z-10
                    space-y-8 my-auto shrink-0
                ">

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
                            <span>Placar da Rodada</span>
                        </div>
                    </div>

                    {/* Card principal */}
                    <section
                        className="
                            border-2 border-b-8
                            rounded-3xl p-6 sm:p-10 lg:p-12
                            shadow-sm space-y-8
                        "
                        style={cardStyle}
                    >
                        <div className="text-center">
                            <h1
                                className="
                                    text-3xl sm:text-4xl
                                    font-black tracking-tight
                                "
                                style={{ color: colors.text }}
                            >
                                Ranking Parcial
                            </h1>

                            <p
                                className="
                                    font-extrabold text-sm
                                    sm:text-base mt-2
                                "
                                style={mutedStyle}
                            >
                                Veja quem subiu e quem desceu na tabela!
                            </p>
                        </div>

                        {/* Erro */}
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

                        {/* Carregamento */}
                        {loading ? (
                            <div className="
                                text-center py-16 space-y-4
                            ">
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
                                    Calculando posições...
                                </p>
                            </div>
                        ) : rankingList.length === 0 ? (
                            <div className="
                                text-center py-12 space-y-4
                            ">
                                <p
                                    className="font-black text-base"
                                    style={mutedStyle}
                                >
                                    Nenhum jogador pontuou ainda.
                                </p>
                            </div>
                        ) : (
                            <div className="
                                space-y-4 max-h-[600px]
                                overflow-y-auto pr-2
                            ">
                                {rankingList.map((player) => {
                                    const hasMovedUp = player.diff > 0;
                                    const hasMovedDown = player.diff < 0;

                                    const offsetY = animateTrigger
                                        ? 0
                                        : (player.prevPos - player.currentPos) * 88;

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
                                                rounded-2xl
                                                p-4 sm:p-5 lg:px-6 lg:py-5
                                                flex items-center justify-between
                                                gap-3 shadow-sm transition-colors
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
                                            {/* Jogador e posição */}
                                            <div className="
                                                flex items-center gap-3
                                                sm:gap-5 min-w-0
                                            ">
                                                <span
                                                    className="
                                                        w-11 h-11 sm:w-14 sm:h-14
                                                        shrink-0 rounded-xl
                                                        flex items-center justify-center
                                                        text-sm sm:text-base
                                                        font-black border-b-4
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
                                                                scale: animateTrigger ? 1 : 0
                                                            }}
                                                            className="
                                                                inline-flex items-center gap-0.5
                                                                px-2 sm:px-3 py-1.5
                                                                rounded-xl text-xs sm:text-sm
                                                                font-black border-2 border-b-4
                                                            "
                                                            style={successStyle}
                                                        >
                                                            <BsArrowUpShort className="w-5 h-5" />
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
                                                                px-2 sm:px-3 py-1.5
                                                                rounded-xl text-xs sm:text-sm
                                                                font-black border-2 border-b-4
                                                            "
                                                            style={dangerStyle}
                                                        >
                                                            <BsArrowDownShort className="w-5 h-5" />
                                                            <span>{player.diff}</span>
                                                        </motion.span>
                                                    ) : (
                                                        <span
                                                            className="px-2 py-1"
                                                            style={mutedStyle}
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
                                })}
                            </div>
                        )}

                        {/* Avançar rodada */}
                        <div className="pt-4">
                            <button
                                onClick={createNewRound}
                                disabled={loading || !!error || rankingList.length === 0}
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
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                                style={{
                                    backgroundColor: colors.success,
                                    borderColor: `${colors.success}CC`
                                }}
                            >
                                <span>Avançar Partida</span>
                                <BsArrowRight className="
                                    w-6 h-6 sm:w-7 sm:h-7
                                " />
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
};

export default RankingPage;


