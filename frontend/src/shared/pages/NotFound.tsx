
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import { BsArrowLeft, BsExclamationTriangle } from 'react-icons/bs';
import { useTheme } from '../../contexts/ThemeContext';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();

    return (
        <>
            <Helmet>
                <title>QuizArena • Página não encontrada</title>
            </Helmet>

            <div
                className="
                    w-full flex-1 min-h-0
                    flex items-center justify-center
                    overflow-y-auto overflow-x-hidden
                    px-4 py-6 sm:p-6
                    select-none font-['Nunito',sans-serif]
                "
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                }}
            >
                <div className="w-full max-w-md relative z-10 text-center space-y-5 my-auto shrink-0">

                    {/* Badge de Erro 404 */}
                    <div className="flex justify-center">
                        <div
                            className="
                                inline-flex items-center gap-2
                                font-black px-4 py-1.5
                                rounded-full text-xs tracking-wider uppercase
                                border-2 border-b-4 shadow-sm
                            "
                            style={{
                                backgroundColor: `${colors.danger}18`,
                                color: colors.danger,
                                borderColor: colors.danger,
                            }}
                        >
                            <span>Erro 404</span>
                        </div>
                    </div>

                    {/* Logo QuizArena */}
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-black tracking-tight flex items-center justify-center gap-2 drop-shadow-md mb-2">
                            <span className="bg-[#FF4B4B] text-white px-3 py-0.5 rounded-2xl -rotate-2 border-b-4 border-[#D43F3F]">
                                Quiz
                            </span>

                            <span className="bg-[#1CB0F6] text-white px-3 py-0.5 rounded-2xl rotate-2 border-b-4 border-[#0092D6]">
                                Arena
                            </span>
                        </h1>
                    </div>

                    {/* Card Principal */}
                    <div
                        className="
                            border-2 border-b-8
                            rounded-3xl p-6 sm:p-8
                            shadow-xl relative space-y-6
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="flex flex-col items-center space-y-3">

                            {/* Ícone de Erro */}
                            <div
                                className="
                                    w-16 h-16 rounded-2xl
                                    border-2 border-b-4
                                    flex items-center justify-center
                                    text-3xl shadow-sm
                                "
                                style={{
                                    backgroundColor: `${colors.primary}20`,
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                }}
                            >
                                <BsExclamationTriangle />
                            </div>

                            <h2
                                className="text-2xl font-black tracking-tight"
                                style={{ color: colors.text }}
                            >
                                Página não encontrada!
                            </h2>

                            <p
                                className="text-xs sm:text-sm font-extrabold leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                Ops! Parece que você errou o caminho da arena ou essa página foi para o espaço.
                            </p>
                        </div>

                        {/* Botões de Ação */}
                        <div className="space-y-3 pt-2">

                            {/* Botão Voltar */}
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="
                                    w-full font-black py-3.5 sm:py-4
                                    rounded-2xl border-2 border-b-4
                                    active:border-b-2 active:translate-y-0.5
                                    transition-all duration-75
                                    flex items-center justify-center gap-2
                                    text-xs sm:text-sm uppercase tracking-wider
                                    cursor-pointer shadow-sm
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text,
                                }}
                            >
                                <BsArrowLeft
                                    className="w-5 h-5"
                                    style={{ color: colors.muted }}
                                />

                                <span>Voltar à Página Anterior</span>
                            </button>

                            {/* Botão Ir para o Início */}
                            <Link
                                to="/"
                                className="
                                    block w-full
                                    text-white font-black
                                    py-3.5 sm:py-4
                                    rounded-2xl border-b-4
                                    active:border-b-0 active:translate-y-1
                                    transition-all duration-75
                                    text-center text-xs sm:text-sm
                                    uppercase tracking-wider
                                    cursor-pointer shadow-md
                                "
                                style={{
                                    backgroundColor: colors.success,
                                    borderColor: '#328C02',
                                }}
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
