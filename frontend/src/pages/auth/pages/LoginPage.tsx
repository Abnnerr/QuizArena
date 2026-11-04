import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiArrowBack, BiLock, BiUser } from 'react-icons/bi';
import { BsArrowRight, BsEye, BsEyeSlash } from 'react-icons/bs';
import { useLogin } from '../hooks/useLogin';
import { Input } from '../../../shared/ui/Input';

const LoginPage: React.FC = () => {

    const {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit,
        feedback,
        loading
    } = useLogin()

    return (
        <>
            <Helmet>
                <title>QuizArena • Login</title>
            </Helmet>

            <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-xl mx-auto my-auto min-h-[calc(100vh-120px)] relative z-10">
                {/* Topbar: Botão Voltar + Badge */}
                <div className="w-full flex items-center justify-between mb-6">
                    <Link
                        to="/"
                        className="inline-flex h-10 items-center gap-2 bg-[#1E1E1E] hover:bg-[#282828] border-2 border-[#2A2A2A] border-b-4 text-[#AAAAAA] hover:text-[#F3F4F6] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                    >
                        <BiArrowBack className="w-5 h-5 text-[#888888]" />
                        <span>Início</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#C69B00] shadow-sm">
                        <span>Acessar Conta</span>
                    </div>
                </div>

                {/* Banner de Boas-vindas */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="w-20 h-20 sm:w-28 sm:h-28 bg-[#1E1E1E] rounded-3xl border-2 border-[#2A2A2A] border-b-8 p-3 shadow-lg flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain filter drop-shadow" />
                    </div>

                    <div className="relative bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-lg w-full sm:w-auto">
                        <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#2A2A2A]" />
                        <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-[#1E1E1E]" />

                        <h2 className="text-xl sm:text-2xl font-black text-[#F3F4F6] tracking-tight">
                            Bem-vindo de volta!
                        </h2>
                        <p className="text-[#AAAAAA] text-xs sm:text-sm font-extrabold mt-1">
                            Entre com sua conta para gerenciar suas partidas na arena.
                        </p>
                    </div>
                </div>

                {/* Formulário de Login */}
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-6 sm:p-8 shadow-lg space-y-4">
                        {/* Container com altura mínima reserva para evitar salto de layout no feedback */}
                        <div className="min-h-[55px] flex items-center  justify-center">
                            {feedback && (
                                <div
                                    className={` w-full p-3.5 transition-all duration-700 rounded-2xl text-xs sm:text-sm font-black text-center border-2 border-b-4 flex items-center justify-center gap-2 ${feedback.type === 'Success'
                                            ? 'bg-[#15320F] border-[#58CC02] text-[#8BEA44]'
                                            : feedback.type === 'Warning'
                                                ? 'bg-[#3A320A] border-[#FFC800] text-[#FFD966]'
                                                : 'bg-[#3B1515] border-[#FF4B4B] text-[#FF6B6B]'
                                        }`}
                                >
                                    <span>{feedback.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Campo: Nome de Usuário usando <Input /> */}
                        <Input
                            label="Nome de Usuário"
                            icon={<BiUser className="w-6 h-6 text-[#FFC800]" />}
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Ex: Gilberto"
                        />

                        {/* Campo: Senha com Link Esqueceu a Senha e Toggle de Visibilidade */}
                        <div>
                            <div className="flex items-center justify-end mb-1">
                                <Link
                                    to="/auth/forgot-password"
                                    className="text-xs font-black text-[#1CB0F6] hover:text-[#0092D6] uppercase tracking-wider transition-colors"
                                >
                                    Esqueceu a senha?
                                </Link>
                            </div>

                            <Input
                                label="Senha"
                                icon={<BiLock className="w-6 h-6 text-[#FFC800]" />}
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-[#888888] hover:text-[#FFFFFF] transition-colors cursor-pointer"
                                    >
                                        {showPassword ? <BsEyeSlash className="w-6 h-6" /> : <BsEye className="w-6 h-6" />}
                                    </button>
                                }
                            />
                        </div>
                    </div>

                    {/* Botão de Envio */}
                    <button
                        type="submit"
                        disabled={Boolean(!userName || !password || loading)}
                        className="w-full h-15 bg-[#58CC02] hover:bg-[#61E002] text-white font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#222222] disabled:border-[#2F2F2F] disabled:text-[#666666] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                    >
                        <span>{loading ? "Entrando..." : "Entrar na Sala"}</span>
                        {!loading && <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                </form>

                {/* Footer Link de Registro */}
                <div className="mt-6 text-center text-xs sm:text-sm font-black text-[#888888]">
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