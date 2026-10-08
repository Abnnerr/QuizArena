import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router';
import { BiMailSend } from 'react-icons/bi';
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
                <title>QuizArena • Recuperar Senha</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-[#D89E00] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#997000] mb-4">
                            Recuperar Senha
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Quiz</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
                        </h1>
                    </div>

                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">

                        {feedback && (
                            <div
                                className={`mb-4 p-3 rounded-2xl text-xs font-bold text-center border-2 ${feedback.type === 'Success'
                                        ? 'bg-[#26890C]/20 border-[#26890C] text-green-300'
                                        : feedback.type === 'Warning'
                                            ? 'bg-[#D89E00]/20 border-[#D89E00] text-amber-300'
                                            : 'bg-[#E21B3C]/20 border-[#E21B3C] text-red-300'
                                    }`}
                            >
                                {feedback.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-300 mb-1.5">
                                    E-mail da Conta
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                                        <BiMailSend className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        disabled={loading}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-11 pr-4 py-3 text-white font-semibold placeholder-zinc-500 focus:outline-none focus:border-[#1368CE] focus:bg-black/60 transition-all text-sm disabled:opacity-50"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>{loading ? 'Enviando...' : 'Enviar Instruções'}</span>
                                {!loading && <BsArrowRight className="w-5 h-5" />}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-xs font-bold text-zinc-400">
                            Lembrou a senha?{' '}
                            <Link
                                to="/auth/login"
                                className="text-cyan-400 hover:text-cyan-300 font-extrabold underline underline-offset-4 transition-colors"
                            >
                                Voltar para o Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ForgotPage;