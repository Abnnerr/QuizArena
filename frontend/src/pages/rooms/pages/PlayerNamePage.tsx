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

            <div className="min-h-screen bg-[#13092E] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-x-hidden select-none font-['Nunito',sans-serif]">
                {/* Elementos decorativos de luz desfocada */}
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    {/* Topo com botão voltar e badge */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 border border-white/10 text-zinc-300 hover:text-white px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer"
                        >
                            <BiArrowBack className="w-4 h-4" />
                            Voltar
                        </Link>

                        <div className="inline-flex items-center gap-2 bg-[#26890C] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#1a5c08]">
                            Identidade
                        </div>
                    </div>

                    {/* Cabeçalho / Título estilizado */}
                    <div className="text-center mb-6">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Seu</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Apelido</span>
                        </h1>
                        <p className="text-zinc-400 text-sm font-semibold mt-2">
                            Como os outros jogadores vão te chamar na arena?
                        </p>
                    </div>

                    {/* Card Principal */}
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        {error && (
                            <div className="mb-6 p-3.5 rounded-2xl text-xs font-bold text-center border-2 bg-[#E21B3C]/20 border-[#E21B3C] text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Nome / Apelido na Arena
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                        <BiUser className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        maxLength={25}
                                        value={playerName}
                                        onChange={(e) => setPlayerName(e.target.value)}
                                        placeholder="Ex: MestreDosQuiz"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Salvando...' : 'Confirmar Apelido'}</span>
                                {!loading && <BsArrowRight className="w-5 h-5" />}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PlayerNamePage;