import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { BiCrown, BiMedal, BiTrophy } from 'react-icons/bi';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { AXIOS } from '../../../service';

type RankingPlayer = {
    player_id: string | number;
    player_name: string;
    score: number;
    position?: number;
};

const PodioPage: React.FC = () => {
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();

    const [ranking, setRanking] = useState<RankingPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPodium = async () => {
            try {
                const { data } = await AXIOS.get(`/room/${roomCode}/podium`);
                const result = data;

                if (result.type !== 'Success') {
                    setError(result.message ?? 'Não foi possível carregar o pódio.');
                    return;
                }

                setRanking(result.data?.ranking ?? result.data ?? []);
            } catch (err) {
                console.error('Erro ao buscar pódio:', err);
                setError('Não foi possível carregar os resultados da partida.');
            } finally {
                setLoading(false);
            }
        };

        if (roomCode) {
            void fetchPodium();
        } else {
            setError('Código da sala não encontrado.');
            setLoading(false);
        }
    }, [roomCode]);

    const topThree = ranking.slice(0, 3);
    const others = ranking.slice(3);

    return (
        <>
            <Helmet>
                <title>QuizArena • Pódio & Resultados</title>
            </Helmet>

            <main className="min-h-screen bg-[#FFFFFF] text-[#4B4B4B] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-25 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="w-full max-w-xl relative z-10 space-y-6 my-auto">

                    {/* Topo com Badge */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={() => navigate('/')}
                            className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer shadow-sm"
                        >
                            <BsArrowLeft className="w-5 h-5 text-[#AFAFAF]" />
                            <span>Início</span>
                        </button>

                        <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-2 border-b-4 border-[#E5B200] shadow-sm">
                            <BiTrophy className="w-5 h-5" />
                            <span>Fim de Partida</span>
                        </div>
                    </div>

                    {/* Balão de Fala e Mascote */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-2.5 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                            <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                        </div>

                        <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto flex-1">
                            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                            <h1 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                                Partida Encerrada!
                            </h1>
                            <p className="text-[#777777] font-extrabold text-xs sm:text-sm mt-0.5">
                                Confira o pódio oficial e a pontuação final dos competidores da arena.
                            </p>
                        </div>
                    </div>

                    {/* Card Principal do Pódio */}
                    <section className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

                        {error && (
                            <div role="alert" className="bg-[#FFD2D2] border-2 border-[#FF4B4B] border-b-4 text-[#A80000] p-4 rounded-2xl text-xs sm:text-sm font-black text-center">
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="inline-block w-10 h-10 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#AFAFAF] font-black text-xs uppercase tracking-wider">
                                    Calculando resultados...
                                </p>
                            </div>
                        ) : ranking.length === 0 ? (
                            <div className="text-center py-8 space-y-4">
                                <p className="text-[#777777] font-black">Nenhum registro de placar encontrado.</p>
                            </div>
                        ) : (
                            <>
                                {/* Top 3 Destaques */}
                                <div className="grid grid-cols-3 gap-3 pt-2">
                                    {topThree.map((player, index) => {
                                        const isFirst = index === 0;
                                        const isSecond = index === 1;

                                        return (
                                            <div
                                                key={player.player_id}
                                                className={`flex flex-col items-center justify-end p-4 rounded-2xl border-2 border-b-8 text-center transition-all ${isFirst
                                                        ? 'bg-[#FFFBF0] border-[#FFC800] transform -translate-y-2 shadow-md'
                                                        : isSecond
                                                            ? 'bg-[#E8F7FE] border-[#1CB0F6]'
                                                            : 'bg-[#FFF2B2]/40 border-[#D89E00]'
                                                    }`}
                                            >
                                                {/* Ícone de Coroa / Medalha */}
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-white mb-2 shadow-sm ${isFirst ? 'bg-[#FFC800] border-b-4 border-[#E5B200] text-[#7A5B00]' : isSecond ? 'bg-[#1CB0F6] border-b-4 border-[#0092D6]' : 'bg-[#D89E00] border-b-4 border-[#B88F00]'
                                                    }`}>
                                                    {isFirst ? <BiCrown className="w-6 h-6" /> : <BiMedal className="w-6 h-6" />}
                                                </div>

                                                <span className="font-black text-sm sm:text-base text-[#4B4B4B] truncate w-full">
                                                    {player.player_name}
                                                </span>
                                                <span className="text-xs font-extrabold text-[#777777] mt-0.5">
                                                    {player.score} pts
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Demais Participantes */}
                                {others.length > 0 && (
                                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1 pt-2">
                                        {others.map((player, idx) => (
                                            <div
                                                key={player.player_id}
                                                className="bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-3 flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="w-7 h-7 rounded-lg bg-white border-2 border-[#E5E5E5] flex items-center justify-center text-xs font-black text-[#AFAFAF]">
                                                        {idx + 4}º
                                                    </span>
                                                    <span className="font-black text-sm text-[#4B4B4B]">
                                                        {player.player_name}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-black text-[#777777]">
                                                    {player.score} pts
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Botão de Retorno */}
                        <div className="pt-2">
                            <button
                                onClick={() => navigate('/')}
                                className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                            >
                                <span>Voltar ao Início</span>
                                <BsArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </section>

                </div>
            </main>
        </>
    );
};

export default PodioPage;