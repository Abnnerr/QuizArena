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

            <main className="min-h-[100dvh] bg-[#121212] text-[#F3F4F6] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#383838 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="w-full max-w-md relative z-10 text-center space-y-5 my-auto">

                    {/* Badge de Erro 404 */}
                    <div className="inline-flex items-center gap-2 bg-[#3B1515] text-[#FF6B6B] font-black px-4 py-1.5 rounded-full text-xs tracking-wider uppercase border-2 border-[#FF4B4B] border-b-4 shadow-sm">
                        <span>Erro 404</span>
                    </div>

                    {/* Logo QuizArena */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-2 drop-shadow-md mb-2">
                            <span className="bg-[#FF4B4B] text-white px-3 py-0.5 rounded-2xl -rotate-2 border-b-4 border-[#D43F3F]">Quiz</span>
                            <span className="bg-[#1CB0F6] text-white px-3 py-0.5 rounded-2xl rotate-2 border-b-4 border-[#0092D6]">Arena</span>
                        </h1>
                    </div>

                    {/* Card Principal */}
                    <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-6 sm:p-8 shadow-xl relative space-y-6">

                        <div className="flex flex-col items-center space-y-3">
                            {/* Ícone com fundo Amarelo Dark */}
                            <div className="w-16 h-16 rounded-2xl bg-[#3B3000] border-2 border-[#FFC800] border-b-4 text-[#FFC800] flex items-center justify-center text-3xl shadow-sm">
                                <BsExclamationTriangle />
                            </div>

                            <h2 className="text-2xl font-black text-[#F3F4F6] tracking-tight">
                                Página não encontrada!
                            </h2>

                            <p className="text-xs sm:text-sm font-extrabold text-[#AAAAAA] leading-relaxed">
                                Ops! Parece que você errou o caminho da arena ou essa página foi para o espaço.
                            </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-3 pt-2">
                            {/* Botão Voltar */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="w-full bg-[#151515] hover:bg-[#282828] text-[#F3F4F6] font-black py-3.5 sm:py-4 rounded-2xl border-2 border-[#2A2A2A] border-b-4 active:border-b-2 active:translate-y-0.5 transition-all duration-75 flex items-center justify-center gap-2 text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-sm"
                            >
                                <BsArrowLeft className="w-5 h-5 text-[#888888]" />
                                <span>Voltar à Página Anterior</span>
                            </button>

                            {/* Botão Ir para o Início */}
                            <Link
                                to="/"
                                className="block w-full bg-[#58CC02] hover:bg-[#61E002] text-white font-black py-3.5 sm:py-4 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all duration-75 text-center text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-md"
                            >
                                Ir para o Início
                            </Link>
                        </div>
                    </div>

                </div>
            </main>
        </>
    );
};

export default NotFoundPage;