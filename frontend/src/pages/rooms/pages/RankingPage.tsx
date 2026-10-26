import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { BiTrophy } from 'react-icons/bi';
import {
    BsArrowRight,
    BsArrowLeft,
    BsArrowUpShort,
    BsArrowDownShort,
    BsDash,
} from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import { AXIOS } from '../../../service';

type PlayerData = {
    player_id: string | number;
    player_name: string;
    score: number;
    position?: number;
};

type RankingWithDiff = PlayerData & {
    currentPos: number;
    diff: number;
};

const RankingPage: React.FC = () => {
    const navigate = useNavigate();
    const { roomCode, round } = useParams<{ roomCode: string; round: string; }>();

    const [rankingList, setRankingList] = useState<RankingWithDiff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
        async function fetchPodium() {
            try {
                const { data } = await AXIOS.get(`/player/${roomCode}/podium`);
                const currentData: PlayerData[] = data?.data ?? data;

                if (!Array.isArray(currentData)) {
                    setError("Formato de ranking inválido.");
                    return;
                }

                const savedPodium = sessionStorage.getItem("podium");
                let previousData: PlayerData[] = [];

                if (savedPodium) {
                    try {
                        const parsed = JSON.parse(savedPodium);
                        previousData = parsed?.data ?? parsed;
                        if (!Array.isArray(previousData)) previousData = [];
                    } catch {
                        previousData = [];
                    }
                }

                const ranking: RankingWithDiff[] = currentData.map((player, index) => {
                    const currentPos = index + 1;
                    const previousIndex = previousData.findIndex(
                        (prev) => String(prev.player_id) === String(player.player_id)
                    );
                    const prevPos = previousIndex !== -1 ? previousIndex + 1 : currentPos;
                    const diff = prevPos - currentPos;

                    return {
                        ...player,
                        currentPos,
                        diff,
                    };
                });

                setRankingList(ranking);
                sessionStorage.setItem("podium", JSON.stringify(currentData));
            } catch (err) {
                console.error("Erro ao carregar o ranking:", err);
                setError("Não foi possível carregar o ranking.");
            } finally {
                setLoading(false);
            }
        }

        if (!roomCode) {
            setError("Código da sala não encontrado.");
            setLoading(false);
            return;
        }

        void fetchPodium();
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
                                Acompanhe os jogadores trocando de posição lentamente!
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
                                <AnimatePresence>
                                    {rankingList.map((player, index) => (
                                        <motion.div
                                            key={player.player_id}
                                            layout
                                            initial={{ opacity: 0, y: 30 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -30 }}
                                            transition={{
                                                layout: {
                                                    type: "spring",
                                                    stiffness: 120, // Mais suave e lento
                                                    damping: 20,    // Menos rígido para fluir devagar
                                                },
                                                opacity: { duration: 0.6, delay: index * 0.15 }, // Entrada cadenciada por item
                                            }}
                                            className="bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-3.5 flex items-center justify-between shadow-xs"
                                        >
                                            <div className="flex items-center gap-3">
                                                {/* Posição atual */}
                                                <span
                                                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-b-2 ${
                                                        player.currentPos === 1
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
                                                {/* Badge de Subida ou Descida animada */}
                                                <div className="flex items-center min-w-[65px] justify-end">
                                                    {player.diff > 0 ? (
                                                        <span className="inline-flex items-center gap-0.5 text-[#2B7200] bg-[#D7FFB8] px-2 py-1 rounded-xl text-xs font-black border-2 border-[#58CC02] border-b-4">
                                                            <BsArrowUpShort className="w-4 h-4 stroke-[2]" />
                                                            <span>+{player.diff}</span>
                                                        </span>
                                                    ) : player.diff < 0 ? (
                                                        <span className="inline-flex items-center gap-0.5 text-[#A80000] bg-[#FFD2D2] px-2 py-1 rounded-xl text-xs font-black border-2 border-[#FF4B4B] border-b-4">
                                                            <BsArrowDownShort className="w-4 h-4 stroke-[2]" />
                                                            <span>{player.diff}</span>
                                                        </span>
                                                    ) : (
                                                        <span className="text-[#AFAFAF] px-2 py-1">
                                                            <BsDash className="w-5 h-5" />
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Pontuação */}
                                                <span className="text-xs sm:text-sm font-black text-[#777777] min-w-[55px] text-right">
                                                    {player.score} pts
                                                </span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Botão de Próxima Rodada */}
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