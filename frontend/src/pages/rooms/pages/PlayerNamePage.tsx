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
            <div className="w-full flex-1 flex flex-col items-center justify-center  py-8 max-w-xl mx-auto">
                <div className="w-full flex items-center justify-between mb-6">
                    <Link
                        to="/dashboard"
                        className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                        <BiArrowBack className="w-5 h-5 text-[#AFAFAF]" />
                        <span>Voltar</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#E5B200]">
                        <span>Identidade</span>
                    </div>
                </div>
                {error && (
                    <div className="w-full mb-6 p-4 rounded-2xl text-sm font-black text-center border-2 border-b-4 bg-[#FFD2D2] border-[#FF4B4B] text-[#A80000] flex items-center justify-center gap-2 animate-bounce-short">
                        <span>{error}</span>
                    </div>
                )}

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-3 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                    </div>

                    <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto">
                        <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                        <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                        <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                            Escolha seu Apelido!
                        </h2>
                        <p className="text-[#777777] text-xs sm:text-sm font-extrabold mt-1">
                            Como os outros jogadores vão te conhecer na arena?
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-6">
                    <div className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-3 text-center">
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
                                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl pl-12 pr-4 py-4 text-[#4B4B4B] font-black tracking-widest text-center text-2xl sm:text-3xl placeholder:text-[#CECECE] focus:outline-none focus:border-[#1CB0F6] focus:bg-white focus:border-b-4 transition-all uppercase"
                            />
                        </div>

                        <div className="mt-3 text-right">
                            <span className="text-xs font-black text-[#AFAFAF]">
                                {playerName.length}/25
                            </span>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !playerName.trim()}
                        className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl shadow-sm transition-all duration-75 flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer disabled:bg-[#E5E5E5] disabled:border-[#CECECE] disabled:text-[#AFAFAF] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                    >
                        <span>{loading ? 'Salvando...' : 'Confirmar Apelido'}</span>
                        {!loading && <BsArrowRight className="w-6 h-6" />}
                    </button>
                </form>
            </div>
        </>
    );
};

export default PlayerNamePage;