import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiArrowBack, BiMailSend } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { useForgot } from '../hooks/useForgot';

const ForgotPage: React.FC = () => {
    const {
        email,
        loading,
        feedback,
        setEmail,
        handleSubmit
    } = useForgot();

    return (
        <>
            <Helmet>
                <title>Recuperar Senha | QuizArena</title>
            </Helmet>
            <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-6 max-w-xl mx-auto my-auto min-h-[calc(100vh-120px)]">
                <div className="w-full flex items-center justify-between mb-6">
                    <Link
                        to="/auth/login"
                        className="inline-flex h-10 items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] active:border-b-2 active:translate-y-0.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black uppercase tracking-wider transition-all cursor-pointer"
                    >
                        <BiArrowBack className="w-5 h-5 text-[#AFAFAF]" />
                        <span>Voltar</span>
                    </Link>

                    <div className="inline-flex items-center gap-2 bg-[#FFC800] text-[#7A5B00] font-black px-4 py-2 rounded-2xl text-xs uppercase tracking-wider border-b-4 border-[#E5B200]">
                        <span>Recuperação</span>
                    </div>
                </div>
                {feedback && (
                    <div
                        className={`w-full mb-6 p-4 rounded-2xl text-sm font-black text-center border-2 border-b-4 flex items-center justify-center gap-2 animate-bounce-short ${feedback.type === 'Success'
                                ? 'bg-[#D7FFB8] border-[#58CC02] text-[#2B7200]'
                                : feedback.type === 'Warning'
                                    ? 'bg-[#FFF2B2] border-[#FFC800] text-[#7A5B00]'
                                    : 'bg-[#FFD2D2] border-[#FF4B4B] text-[#A80000]'
                            }`}
                    >
                        <span>{feedback.message}</span>
                    </div>
                )}

                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-3 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                    </div>
                    <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto">
                        <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                        <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                        <h2 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                            Esqueceu sua senha?
                        </h2>
                        <p className="text-[#777777] text-xs sm:text-sm font-extrabold mt-1">
                            Sem problemas! Digite seu e-mail para enviarmos as instruções.
                        </p>
                    </div>
                </div>
                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm">
                        <label className="block text-xs font-black uppercase tracking-widest text-[#AFAFAF] mb-3 text-center sm:text-left">
                            E-mail da Conta
                        </label>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFC800] z-10">
                                <BiMailSend className="w-7 h-7 text-[#FFC800]" />
                            </div>

                            <input
                                type="email"
                                required
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 rounded-2xl pl-12 pr-4 py-4 text-[#4B4B4B] font-black text-center text-lg sm:text-xl placeholder:text-[#CECECE] focus:outline-none focus:border-[#1CB0F6] focus:bg-white focus:border-b-4 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !email.trim()}
                        className="w-full h-15 bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl shadow-sm transition-all duration-75 flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer disabled:bg-[#E5E5E5] disabled:border-[#CECECE] disabled:text-[#AFAFAF] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                    >
                        <span>{loading ? 'Enviando...' : 'Enviar Instruções'}</span>
                        {!loading && <BsArrowRight className="w-6 h-6" />}
                    </button>
                </form>
                <div className="mt-6 text-center text-xs sm:text-sm font-black text-[#AFAFAF]">
                    Lembrou a senha?{' '}
                    <Link
                        to="/auth/login"
                        className="text-[#1CB0F6] hover:text-[#0092D6] font-black uppercase tracking-wider ml-1 underline underline-offset-4 transition-colors"
                    >
                        Voltar para o Login
                    </Link>
                </div>
            </div>
        </>
    );
};

export default ForgotPage;