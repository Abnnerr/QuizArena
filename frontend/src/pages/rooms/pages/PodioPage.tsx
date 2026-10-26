import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BiCrown, BiMedal, BiTrophy } from 'react-icons/bi';
import { BsArrowRight, BsArrowLeft } from 'react-icons/bs';
import { motion, AnimatePresence } from 'framer-motion';
import usePodio from '../hooks/usePodio';


const PodioPage: React.FC = () => {
    const {
        orderedPodium,
        error,
        visibleCount,
        loading,
        topThree,
        clearRoom,
        navigate
    } = usePodio()

    return (
        <>
            <Helmet>
                <title>QuizArena • Fim de Partida • Pódio Final</title>
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

                    {/* Topo com Botão de Retorno e Badge */}
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
                            <span>Pódio Final</span>
                        </div>
                    </div>

                    {/* Card Principal do Pódio */}
                    <section className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-center">

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-[#4B4B4B] tracking-tight">
                                Partida Finalizada! 🏆
                            </h1>
                            <p className="text-[#777777] font-extrabold text-xs sm:text-sm mt-1">
                                Revelando os grandes campeões da arena...
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
                                    Calculando pódio final...
                                </p>
                            </div>
                        ) : topThree.length === 0 ? (
                            <div className="text-center py-8 space-y-4">
                                <p className="text-[#777777] font-black">Nenhum jogador pontuou na partida.</p>
                            </div>
                        ) : (
                            /* Pedestais com Aparição Sequencial (3º ➔ 2º ➔ 1º) */
                            <div className="grid grid-cols-3 gap-3 items-end pt-6 pb-2 min-h-[260px]">
                                {orderedPodium.map(({ player, originalIndex }) => {
                                    const isFirst = originalIndex === 0;
                                    const isSecond = originalIndex === 1;
                                    const isThird = originalIndex === 2;

                                    // Ordem de revelação: 
                                    // 3º lugar (index 2) aparece no passo 1
                                    // 2º lugar (index 1) aparece no passo 2
                                    // 1º lugar (index 0) aparece no passo 3
                                    const revealOrder = isThird ? 1 : isSecond ? 2 : 3;
                                    const isVisible = visibleCount >= revealOrder;

                                    const playerName = player.players?.player_name ?? player.player_name ?? 'Participante';

                                    return (
                                        <div key={player.player_id} className="flex flex-col justify-end h-full">
                                            <AnimatePresence>
                                                {isVisible && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 70, scale: 0.8 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        transition={{
                                                            type: "spring",
                                                            stiffness: 260,
                                                            damping: 16,
                                                        }}
                                                        className={`flex flex-col items-center justify-between p-4 sm:p-5 rounded-3xl border-2 border-b-8 text-center transition-all ${isFirst
                                                            ? 'bg-[#FFFBF0] border-[#FFC800] min-h-[220px] sm:min-h-[250px] shadow-md z-10 -translate-y-2'
                                                            : isSecond
                                                                ? 'bg-[#E8F7FE] border-[#1CB0F6] min-h-[180px] sm:min-h-[210px]'
                                                                : 'bg-[#FFF2B2]/40 border-[#D89E00] min-h-[150px] sm:min-h-[180px]'
                                                            }`}
                                                    >
                                                        {/* Ícone de Destaque */}
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white shadow-sm ${isFirst
                                                            ? 'bg-[#FFC800] border-2 border-b-4 border-[#E5B200] text-[#7A5B00] animate-bounce'
                                                            : isSecond
                                                                ? 'bg-[#1CB0F6] border-2 border-b-4 border-[#0092D6]'
                                                                : 'bg-[#D89E00] border-2 border-b-4 border-[#B88F00]'
                                                            }`}>
                                                            {isFirst ? <BiCrown className="w-7 h-7" /> : <BiMedal className="w-6 h-6" />}
                                                        </div>

                                                        {/* Informações do Jogador */}
                                                        <div className="w-full space-y-1 my-auto">
                                                            <span className="block font-black text-xs sm:text-sm text-[#AFAFAF] uppercase tracking-wider">
                                                                {originalIndex + 1}º Lugar
                                                            </span>
                                                            <span className="block font-black text-sm sm:text-lg text-[#4B4B4B] truncate w-full px-1">
                                                                {playerName}
                                                            </span>
                                                        </div>

                                                        {/* Pontuação */}
                                                        <div className="bg-white/90 border-2 border-[#E5E5E5] rounded-xl py-1.5 px-3 w-full shadow-xs">
                                                            <span className="text-xs sm:text-sm font-black text-[#777777]">
                                                                {player.score} pts
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Botão de Encerrar Partida */}
                        <div className="pt-4">
                            <button
                                onClick={clearRoom}
                                className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer transition-all shadow-sm"
                            >
                                <span>Encerrar Partida</span>
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