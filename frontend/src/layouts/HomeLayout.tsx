
import type React from "react";
import { Link, Outlet } from "react-router";
import { useState } from "react";

import { useAuth } from "../contexts/hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

import {
    FiMoon,
    FiSettings,
    FiSun,
    FiX,
} from "react-icons/fi";

const HomeLayout: React.FC = () => {
    const { user } = useAuth();
    const { theme, setTheme, colors } = useTheme();

    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {/* HEADER */}
            <header
                className="w-full border-b-2 py-3 px-4 sm:px-10 flex items-center justify-between relative z-20 shadow-md"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <Link to="/" className="flex items-center gap-3 group">
                    <div
                        className="w-10 h-10 rounded-xl border-2 border-b-4 p-1 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        }}
                    >
                        <img
                            src="/favicon-quiz.png"
                            alt="QuizArena"
                            className="h-full w-full object-contain filter drop-shadow"
                        />
                    </div>

                    <span
                        className="hidden sm:inline text-xl sm:text-2xl font-black tracking-tight"
                        style={{ color: colors.text }}
                    >
                        Quiz<span className="text-[#1CB0F6]">Arena</span>
                    </span>
                </Link>

                <div className="flex items-center gap-2 sm:gap-3">
                    {/* CONFIGURAÇÕES */}
                    <button
                        onClick={() => setShowSettings(true)}
                        aria-label="Abrir configurações"
                        className="w-11 h-11 flex items-center justify-center rounded-2xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text,
                        }}
                    >
                        <FiSettings size={20} />
                    </button>

                    {!user && (
                        <>
                            <Link
                                to="/auth/login"
                                className="h-11 flex items-center justify-center font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text,
                                }}
                            >
                                Entrar
                            </Link>

                            <Link
                                to="/auth/register"
                                className="bg-[#1CB0F6] h-11 flex items-center justify-center hover:bg-[#00A2ED] text-white font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#0092D6] active:border-b-0 active:translate-y-1 transition-all shadow-sm"
                            >
                                Criar Conta
                            </Link>
                        </>
                    )}

                    {user && (
                        <Link
                            to="/room/create"
                            className="bg-[#1CB0F6] h-11 flex items-center justify-center hover:bg-[#00A2ED] text-white font-black px-5 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#0092D6] active:border-b-0 active:translate-y-1 transition-all shadow-sm"
                        >
                            Criar Sala
                        </Link>
                    )}
                </div>
            </header>

            {/* CONTEÚDO */}
            <Outlet />

            {/* FOOTER */}
            <footer
                className="w-full border-t-2 py-4 px-4 sm:px-10 relative z-20"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div
                        className="text-center sm:text-left text-xs sm:text-sm font-black"
                        style={{ color: colors.muted }}
                    >
                        Quer criar seu próprio Quiz?{" "}
                        <Link
                            to="/auth/register"
                            className="text-[#1CB0F6] hover:text-[#0092D6] font-black uppercase tracking-wider ml-1 underline underline-offset-4"
                        >
                            Criar conta Host
                        </Link>
                    </div>
                </div>
            </footer>

            {/* MODAL DE CONFIGURAÇÕES */}
            {showSettings && (
                <div
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setShowSettings(false)}
                >
                    <div
                        className="w-full max-w-md border-2 border-b-8 rounded-3xl p-5 sm:p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CABEÇALHO DO MODAL */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2
                                    className="text-xl font-black"
                                    style={{ color: colors.text }}
                                >
                                    Personalização
                                </h2>

                                <p
                                    className="text-xs font-bold mt-1"
                                    style={{ color: colors.muted }}
                                >
                                    Deixe o QuizArena com a sua cara!
                                </p>
                            </div>

                            <button
                                onClick={() => setShowSettings(false)}
                                aria-label="Fechar configurações"
                                className="w-10 h-10 flex items-center justify-center rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.muted,
                                }}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* TEMAS */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <FiSun className="text-[#FFC800]" size={18} />

                                <h3
                                    className="text-sm font-black uppercase tracking-wider"
                                    style={{ color: colors.text }}
                                >
                                    Tema
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {/* TEMA ESCURO */}
                                <button
                                    onClick={() => setTheme("darkTheme")}
                                    aria-pressed={theme === "darkTheme"}
                                    className="p-3 rounded-2xl border-2 border-b-4 transition-all active:translate-y-0.5 active:border-b-2"
                                    style={{
                                        borderColor:
                                            theme === "darkTheme"
                                                ? "#1CB0F6"
                                                : colors.border,
                                        backgroundColor: colors.surface,
                                    }}
                                >
                                    <div className="h-16 rounded-xl bg-[#121212] border-2 border-[#383838] flex items-center justify-center mb-2">
                                        <FiMoon
                                            size={25}
                                            className="text-[#F3F4F6]"
                                        />
                                    </div>

                                    <span
                                        className="text-xs font-black"
                                        style={{ color: colors.text }}
                                    >
                                        Escuro
                                    </span>

                                    {theme === "darkTheme" && (
                                        <span className="block text-[10px] text-[#1CB0F6] font-black mt-1">
                                            ATIVO
                                        </span>
                                    )}
                                </button>

                                {/* TEMA CLARO */}
                                <button
                                    onClick={() => setTheme("lightTheme")}
                                    aria-pressed={theme === "lightTheme"}
                                    className="p-3 rounded-2xl border-2 border-b-4 transition-all active:translate-y-0.5 active:border-b-2"
                                    style={{
                                        borderColor:
                                            theme === "lightTheme"
                                                ? "#1CB0F6"
                                                : colors.border,
                                        backgroundColor: colors.surface,
                                    }}
                                >
                                    <div
                                        className="h-16 rounded-xl border-2 flex items-center justify-center mb-2"
                                        style={{
                                            backgroundColor: "#F5F3ED",
                                            borderColor: "#E7E4DA",
                                        }}
                                    >
                                        <FiSun
                                            size={25}
                                            className="text-[#E9B949]"
                                        />
                                    </div>

                                    <span
                                        className="text-xs font-black"
                                        style={{ color: colors.text }}
                                    >
                                        Claro
                                    </span>

                                    {theme === "lightTheme" && (
                                        <span className="block text-[10px] text-[#1CB0F6] font-black mt-1">
                                            ATIVO
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeLayout;
