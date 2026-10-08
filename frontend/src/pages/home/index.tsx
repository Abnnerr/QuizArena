import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import { BiHash } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { FaGamepad } from 'react-icons/fa';
import { GiSparkles } from 'react-icons/gi';

const HomePage: React.FC = () => {
    const [roomCode, setRoomCode] = useState('');
    const navigate = useNavigate();

    const handleJoinRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomCode.trim()) return;

        // Redireciona para a sala (ajuste a rota conforme sua estrutura)
        navigate(`/room/${roomCode.trim().toUpperCase()}`);
    };

    return (
        <>
            <Helmet>
                <title>QuizArena ● Início</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                <div className="absolute top-12 -left-12 w-56 h-56 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-3xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-72 h-72 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-44 h-44 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-3xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-52 h-52 bg-[#26890C]/15 -rotate-12 rounded-full blur-3xl pointer-events-none" />
                
                <header className="absolute top-6 right-6 z-20 flex items-center gap-3">
                    <Link
                        to="/auth/login"
                        className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-2 rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/10 backdrop-blur-md"
                    >
                        Entrar
                    </Link>
                    <Link
                        to="/auth/register"
                        className="bg-[#1368CE] hover:bg-[#1a76e8] text-white font-extrabold px-4 py-2 rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#0E4B94] active:shadow-none active:translate-y-1 transition-all"
                    >
                        Criar Conta
                    </Link>
                </header>

                <div className="w-full max-w-md relative z-10 my-auto">
                    <div className="text-center mb-8 items-center flex flex-col">
                           <img src="/favicon-quiz.png" alt="" className='h-20 w-20' />
                        <p className="text-zinc-300 text-sm sm:text-base font-semibold mt-4">
                            Digite o PIN ou nome da sala para entrar na partida!
                        </p>
                    </div>
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        <form onSubmit={handleJoinRoom} className="space-y-4">

                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2 text-center">
                                    Código da Sala
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <BiHash className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        placeholder="Ex: ARENA123"
                                        maxLength={12}
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-black tracking-widest text-center text-xl placeholder-zinc-500 focus:outline-none focus:border-[#26890C] focus:bg-black/60 transition-all uppercase"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!roomCode.trim()}
                                className="w-full mt-2 bg-[#26890C] hover:bg-[#2cb20d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer"
                            >
                                <FaGamepad className="w-5 h-5" />
                                <span>Entrar na Sala</span>
                                <BsArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                    <div className="mt-8 text-center text-xs font-bold text-zinc-400">
                        Quer criar seu próprio Quiz?{' '}
                        <Link
                            to="/auth/register"
                            className="text-amber-400 hover:text-amber-300 font-extrabold underline underline-offset-4 transition-colors"
                        >
                            Crie uma conta de Host
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HomePage;