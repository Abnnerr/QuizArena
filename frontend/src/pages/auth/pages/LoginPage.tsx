import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiArrowBack, BiLock, BiUser } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { useLogin } from '../hooks/useLogin';

const LoginPage: React.FC = () => {

    const {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit
    } = useLogin()

    return (
        <>
            <Helmet>
                <title>QuizArena • Login</title>
            </Helmet>
            <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-xl mx-auto my-auto min-h-[calc(100vh-120px)]">
                <div className="w-full flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="inline-flex h-10 items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                        <BiArrowBack className="w-5 h-5 text-[#AFAFAF]" />
                        <span>Início</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#E5B200]">
                        <span>Acessar Conta</span>
                    </div>
                </div>
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-3 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                    </div>

                    <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto">
                        <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                        <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                        <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                            Bem-vindo de volta!
                        </h2>
                        <p className="text-[#777777] text-xs sm:text-sm font-extrabold mt-1">
                            Entre com sua conta para gerenciar suas partidas na arena.
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-2 text-center sm:text-left">
                                Nome de Usuário
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFC800] z-10">
                                    <BiUser className="w-7 h-7 text-[#FFC800]" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    placeholder="Ex: Gilberto"
                                    className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl pl-12 pr-4 py-3.5 text-[#4B4B4B] font-black text-base sm:text-lg placeholder:text-[#CECECE] focus:outline-none focus:border-[#1CB0F6] focus:bg-white focus:border-b-4 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF]">
                                    Senha
                                </label>
                                <Link
                                    to="/auth/forgot-password"
                                    className="text-xs font-black text-[#1CB0F6] hover:text-[#0092D6] uppercase tracking-wider transition-colors"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFC800] z-10">
                                    <BiLock className="w-7 h-7 text-[#FFC800]" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl pl-12 pr-12 py-3.5 text-[#4B4B4B] font-black text-base sm:text-lg placeholder:text-[#CECECE] focus:outline-none focus:border-[#1CB0F6] focus:bg-white focus:border-b-4 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#AFAFAF] hover:text-[#4B4B4B] transition-colors cursor-pointer z-10"
                                >
                                    {showPassword ? <BsEyeSlash className="w-6 h-6" /> : <BsEye className="w-6 h-6" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        type="submit"
                        disabled={Boolean(!userName || !password)}
                        className="w-full h-15 bg-[#58CC02] hover:bg-[#61E002] text-white font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#E5E5E5] disabled:border-[#CECECE] disabled:text-[#AFAFAF] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                    >
                        <span>Entrar na Sala</span>
                        <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </form>
                <div className="mt-6 text-center text-xs sm:text-sm font-black text-[#AFAFAF]">
                    Ainda não tem uma conta?{' '}
                    <Link
                        to="/auth/register"
                        className="text-[#1CB0F6] hover:text-[#0092D6] font-black uppercase tracking-wider ml-1 underline underline-offset-4 transition-colors"
                    >
                        Criar Conta
                    </Link>
                </div>
            </div>
        </>
    );
};

export default LoginPage;