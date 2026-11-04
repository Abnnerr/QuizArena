import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiUser, BiArrowBack } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { usePlayerName } from '../hooks/userPlayerName';

const PlayerNamePage: React.FC = () => {
    const {
        playerName,
        setPlayerName,
        loading,
        error,
        handleSubmit,
    } = usePlayerName();
    return (
        <>
            <Helmet>
                <title>QuizArena • Nome de Jogador</title>
            </Helmet>

            <main className="w-full min-h-[100dvh] bg-[#121212] text-[#F3F4F6] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#383838 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="w-full max-w-xl relative z-10 flex flex-col items-center justify-center space-y-6 my-auto">

                    {/* Topbar: Botão Voltar + Tag Identidade */}
                    <div className="w-full flex items-center justify-between gap-3">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-2 bg-[#1E1E1E] hover:bg-[#282828] border-2 border-[#2A2A2A] border-b-4 text-[#AAAAAA] hover:text-[#F3F4F6] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                        >
                            <BiArrowBack className="w-5 h-5 text-[#888888]" />
                            <span>Voltar</span>
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#C69B00] shadow-sm">
                            <span>Identidade</span>
                        </div>
                    </div>

                    {/* Alerta de Erro */}
                    {error && (
                        <div className="w-full p-4 rounded-2xl text-xs sm:text-sm font-black text-center border-2 border-b-4 bg-[#3B1515] border-[#FF4B4B] text-[#FF6B6B] flex items-center justify-center gap-2 animate-bounce">
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Header com Logo e Balão de Fala */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#1E1E1E] rounded-3xl border-2 border-[#2A2A2A] border-b-8 p-3 shadow-lg flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                            <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain filter drop-shadow" />
                        </div>

                        <div className="relative bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-lg w-full sm:w-auto flex-1">
                            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#2A2A2A]" />
                            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-[#1E1E1E]" />

                            <h2 className="text-xl sm:text-2xl font-black text-[#F3F4F6] tracking-tight">
                                Escolha seu Apelido!
                            </h2>
                            <p className="text-[#AAAAAA] text-xs sm:text-sm font-extrabold mt-1">
                                Como os outros jogadores vão te conhecer na arena?
                            </p>
                        </div>
                    </div>

                    {/* Formulário */}
                    <form onSubmit={handleSubmit} className="w-full space-y-6">
                        <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-6 sm:p-8 shadow-xl">
                            <label className="block text-xs font-black uppercase tracking-widest text-[#888888] mb-3 text-center">
                                Seu Apelido na Arena
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFC800] z-10">
                                    <BiUser className="w-7 h-7 text-[#FFC800]" />
                                </div>

                                <input
                                    type="text"
                                    required
                                    maxLength={25}
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    placeholder="MESTREDOSQUIZ"
                                    className="w-full bg-[#151515] border-2 border-[#2A2A2A] border-b-4 rounded-2xl pl-12 pr-4 py-4 text-[#F3F4F6] font-black tracking-widest text-center text-xl sm:text-3xl placeholder:text-[#555555] focus:outline-none focus:border-[#1CB0F6] focus:bg-[#121212] focus:border-b-4 transition-all uppercase"
                                />
                            </div>

                            <div className="mt-3 text-right">
                                <span className="text-xs font-black text-[#888888]">
                                    {playerName.length}/25
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !playerName.trim()}
                            className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl shadow-md transition-all duration-75 flex items-center justify-center gap-3 text-base sm:text-lg uppercase tracking-wider cursor-pointer disabled:bg-[#222222] disabled:border-[#2F2F2F] disabled:text-[#666666] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                        >
                            <span>{loading ? 'Salvando...' : 'Confirmar Apelido'}</span>
                            {!loading && <BsArrowRight className="w-6 h-6" />}
                        </button>
                    </form>

                </div>
            </main>
        </>
    );
};

export default PlayerNamePage;