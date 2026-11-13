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
    const { roomCode, round } = useParams<{ roomCode: string; round: string; }>();

    const [rankingList, setRankingList] = useState<RankingWithDiff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    async function createNewRound() {
        if (!roomCode || !round) return;

        try {
            const { data } = await AXIOS.post(`/round/${roomCode}/roundFinished`, {
                round_id: Number(round)
            });

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

        async function fetchPodium() {
            try {
                const { data } = await AXIOS.get(`/player/${roomCode}/podium`);
                const currentData = data?.data;

                if (!Array.isArray(currentData)) {
                    throw new Error("Formato de ranking inválido.");
                }

                const currentPlayers: PlayerData[] = currentData.map((item: any) => ({
                    player_id: item.player_id,
                    player_name: item.players.player_name,
                    score: item.score
                }));

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

                const baselineData = previousData.length > 0 ? previousData : currentPlayers;

                const processedRanking: RankingWithDiff[] = currentPlayers.map((player, index) => {
                    const currentPos = index + 1;

                    const previousIndex = baselineData.findIndex(
                        prev => prev.player_id === player.player_id
                    );

                    const prevPos = previousIndex !== -1
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

                // Ordena sempre pela posição atual para exibir na tela
                const sortedList = processedRanking.sort((a, b) => a.currentPos - b.currentPos);

                setRankingList(sortedList);
                setLoading(false);

                // Salva o pódio atual para a próxima rodada
                sessionStorage.setItem("podium", JSON.stringify(currentPlayers));

                // Dispara a animação logo após o carregamento
                setTimeout(() => {
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
            return;
        }

        void fetchPodium();

        return () => {
            active = false;
        };

    }, [roomCode]);

    return (
        <>
            <Helmet>
                <title>QuizArena • Classificação da Rodada</title>
            </Helmet>

            <main className="min-h-screen bg-[#F7F7F7] text-[#4B4B4B] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-40 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                        backgroundSize: '24px 24px',
                    }}
                />

                <div className="w-full max-w-xl relative z-10 space-y-6 my-auto">

                    {/* Topo com Botão Voltar e Badge */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer shadow-sm"
                        >
                            <BsArrowLeft className="w-5 h-5 text-[#AFAFAF]" />
                            <span>Voltar</span>
                        </button>

                        <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-2 border-b-4 border-[#E5B200] shadow-sm">
                            <BiTrophy className="w-5 h-5" />
                            <span>Placar da Rodada</span>
                        </div>
                    </div>

                    {/* Card Principal do Ranking */}
                    <section className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

                        <div className="text-center">
                            <h1 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                                Ranking Parcial
                            </h1>
                            <p className="text-[#777777] font-extrabold text-xs sm:text-sm mt-1">
                                Veja quem subiu e quem desceu na tabela!
                            </p>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="bg-[#FFD2D2] border-2 border-[#FF4B4B] border-b-4 text-[#A80000] p-4 rounded-2xl text-xs sm:text-sm font-black text-center"
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="inline-block w-10 h-10 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#AFAFAF] font-black text-xs uppercase tracking-wider">
                                    Calculando posições...
                                </p>
                            </div>
                        ) : rankingList.length === 0 ? (
                            <div className="text-center py-8 space-y-4">
                                <p className="text-[#777777] font-black">Nenhum jogador pontuou ainda.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                {rankingList.map((player) => {
                                    const hasMovedUp = player.diff > 0;
                                    const hasMovedDown = player.diff < 0;

                                    // Deslocamento vertical exato baseado na variação de posições (prevPos - currentPos) * altura do card
                                    const offsetY = animateTrigger ? 0 : (player.prevPos - player.currentPos) * 72;

                                    return (
                                        <motion.div
                                            key={player.player_id}
                                            initial={{ y: offsetY, opacity: 0 }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                backgroundColor: animateTrigger && hasMovedUp ? "#F4FFEC" : animateTrigger && hasMovedDown ? "#FFF5F5" : "#F7F7F7"
                                            }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 70,
                                                damping: 14,
                                                opacity: { duration: 0.3 }
                                            }}
                                            className={`border-2 border-b-4 rounded-2xl p-3.5 flex items-center justify-between shadow-xs transition-colors ${animateTrigger && hasMovedUp
                                                    ? "border-[#58CC02]"
                                                    : animateTrigger && hasMovedDown
                                                        ? "border-[#FF4B4B]"
                                                        : "border-[#E5E5E5]"
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-b-2 ${player.currentPos === 1
                                                            ? 'bg-[#FFC800] border-[#E5B200] text-[#7A5B00]'
                                                            : player.currentPos === 2
                                                                ? 'bg-[#1CB0F6] border-[#0092D6] text-white'
                                                                : player.currentPos === 3
                                                                    ? 'bg-[#D89E00] border-[#B88F00] text-white'
                                                                    : 'bg-white border-[#E5E5E5] text-[#AFAFAF]'
                                                        }`}
                                                >
                                                    {player.currentPos}º
                                                </span>

                                                <span className="font-black text-sm sm:text-base text-[#4B4B4B]">
                                                    {player.player_name}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center min-w-[65px] justify-end">
                                                    {hasMovedUp ? (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: animateTrigger ? 1 : 0 }}
                                                            className="inline-flex items-center gap-0.5 text-[#2B7200] bg-[#D7FFB8] px-2 py-1 rounded-xl text-xs font-black border-2 border-[#58CC02] border-b-4"
                                                        >
                                                            <BsArrowUpShort className="w-4 h-4 stroke-[2]" />
                                                            <span>+{player.diff}</span>
                                                        </motion.span>
                                                    ) : hasMovedDown ? (
                                                        <motion.span
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: animateTrigger ? 1 : 0 }}
                                                            className="inline-flex items-center gap-0.5 text-[#A80000] bg-[#FFD2D2] px-2 py-1 rounded-xl text-xs font-black border-2 border-[#FF4B4B] border-b-4"
                                                        >
                                                            <BsArrowDownShort className="w-4 h-4 stroke-[2]" />
                                                            <span>{player.diff}</span>
                                                        </motion.span>
                                                    ) : (
                                                        <span className="text-[#AFAFAF] px-2 py-1">
                                                            <BsDash className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </div>

                                                <span className="text-xs sm:text-sm font-black text-[#777777] min-w-[55px] text-right">
                                                    {player.score} pts
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Botão de Avançar Partida */}
                        <div className="pt-2">
                            <button
                                onClick={createNewRound}
                                className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                            >
                                <span>Avançar Partida</span>
                                <BsArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default RankingPage;