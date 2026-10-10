import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import { BsArrowLeft, BsExclamationTriangle } from 'react-icons/bs';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <Helmet>
                <title>QuizArena • Página não encontrada</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-md relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-[#E21B3C] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#A0132B] mb-4">
                        Erro 404
                    </div>
                    <div className="mb-6">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md mb-2">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Quiz</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
                        </h1>
                    </div>
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative space-y-6">
                        <div className="flex flex-col items-center space-y-3">
                            <div className="w-16 h-16 rounded-2xl bg-[#D89E00]/20 border border-[#D89E00]/30 text-[#D89E00] flex items-center justify-center text-3xl shadow-inner">
                                <BsExclamationTriangle />
                            </div>

                            <h2 className="text-2xl font-black text-white tracking-tight">
                                Página não encontrada!
                            </h2>

                            <p className="text-xs sm:text-sm font-bold text-zinc-300 leading-relaxed">
                                Ops! Parece que você errou o caminho da arena ou essa página foi para o espaço.
                            </p>
                        </div>
                        <div className="space-y-3 pt-2">
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full bg-[#1368CE] hover:bg-[#1875e9] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#0E4B94] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                            >
                                <BsArrowLeft className="w-5 h-5" />
                                <span>Voltar à Página Anterior</span>
                            </button>

                            <Link
                                to="/"
                                className="block w-full bg-[#26890C] hover:bg-[#2cb20d] text-white font-black py-3.5 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 text-center text-sm uppercase tracking-wider cursor-pointer"
                            >
                                Ir para o Início
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};

export default NotFoundPage;