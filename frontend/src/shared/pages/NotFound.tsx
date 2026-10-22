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

            <div className="min-h-screen bg-[#FFFFFF] text-[#4B4B4B] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">

                {/* Background dot pattern estilo Duolingo */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-25 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="w-full max-w-md relative z-10 text-center">

                    {/* Badge de Erro 404 em Vermelho Duolingo */}
                    <div className="inline-flex items-center gap-2 bg-[#FF4B4B] text-white font-black px-4 py-1.5 rounded-full text-xs tracking-wider uppercase border-b-4 border-[#D43F3F] shadow-sm mb-4">
                        <span>Erro 404</span>
                    </div>

                    {/* Logo QuizArena */}
                    <div className="mb-6">
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-2 drop-shadow-sm mb-2">
                            <span className="bg-[#FF4B4B] text-white px-3 py-0.5 rounded-2xl -rotate-2 border-b-4 border-[#D43F3F]">Quiz</span>
                            <span className="bg-[#1CB0F6] text-white px-3 py-0.5 rounded-2xl rotate-2 border-b-4 border-[#0092D6]">Arena</span>
                        </h1>
                    </div>

                    {/* Card Principal Estilo Duolingo */}
                    <div className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm relative space-y-6">

                        <div className="flex flex-col items-center space-y-3">
                            {/* Ícone com fundo Amarelo Duolingo */}
                            <div className="w-16 h-16 rounded-2xl bg-[#FFF2B2] border-2 border-[#FFC800] border-b-4 text-[#7A5B00] flex items-center justify-center text-3xl shadow-sm">
                                <BsExclamationTriangle />
                            </div>

                            <h2 className="text-2xl font-black text-[#4B4B4B] tracking-tight">
                                Página não encontrada!
                            </h2>

                            <p className="text-xs sm:text-sm font-extrabold text-[#777777] leading-relaxed">
                                Ops! Parece que você errou o caminho da arena ou essa página foi para o espaço.
                            </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-3 pt-2">
                            {/* Botão Azul Duolingo */}
                            <button
                                onClick={() => navigate(-1)}
                                className="w-full h-15 bg-[#1CB0F6] hover:bg-[#00A2ED] text-white font-black py-4 rounded-2xl border-b-4 border-[#0092D6] active:border-b-0 active:translate-y-1 transition-all duration-75 flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer shadow-sm"
                            >
                                <BsArrowLeft className="w-5 h-5" />
                                <span>Voltar à Página Anterior</span>
                            </button>

                            {/* Botão Verde Duolingo */}
                            <Link
                                to="/"
                                className="block h-15 w-full bg-[#58CC02] hover:bg-[#61E002] text-white font-black py-4 rounded-2xl border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all duration-75 text-center text-sm uppercase tracking-wider cursor-pointer shadow-sm"
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