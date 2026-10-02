import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiLock, BiUser } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { GiSparkles } from 'react-icons/gi';

const LoginPage: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica de login aqui
        console.log({ userName, password });
    };

    return (
        <>
            <Helmet>
                <title>QuizArena ● Login</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                {/* Elementos visuais de fundo */}
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-[#26890C] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#1e6a09] mb-4">
                            Login
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Quiz</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
                        </h1>
                    </div>

                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* Campo: Nome de Usuário */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    Nome de Usuário
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                        <BiUser className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        placeholder="Ex: MestreDosGames"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            {/* Campo: Senha */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300">
                                        Senha
                                    </label>
                                </div>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                        <BiLock className="w-5 h-5" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-11 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <BsEyeSlash className="w-5 h-5" /> : <BsEye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Botão Principal 3D Estilo Kahoot */}
                            <button
                                type="submit"
                                className="w-full mt-2 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                            >
                                <span>Entrar na Arena</span>
                                <BsArrowRight className="w-5 h-5" />
                            </button>
                        </form>

                        {/* Link para Cadastro */}
                        <div className="mt-6 text-center text-xs font-bold text-zinc-400">
                            Ainda não tem uma conta?{' '}
                            <Link
                                to="/auth/register"
                                className="text-cyan-400 hover:text-cyan-300 font-extrabold underline underline-offset-4 transition-colors"
                            >
                                Criar Conta
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;