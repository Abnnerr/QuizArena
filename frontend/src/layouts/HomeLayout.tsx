
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
    FiSettings,
    FiX,
    FiSun,
    FiMoon,
    FiHome,
    FiGrid,
} from "react-icons/fi";

import { useAuth } from "../contexts/hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";
import Button from "../shared/ui/Button";

const HomeLayout: React.FC = () => {
    const { user } = useAuth();
    const { theme, setTheme, colors } = useTheme();
    const location = useLocation();

    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setShowSettings(false);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    const isHome = location.pathname === "/";

    return (
        <div
            className="min-h-screen flex flex-col overflow-x-hidden"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            <main className="flex-1 min-w-0">
                {/* HEADER */}
                <header
                    className="
                        min-h-16 sm:min-h-20
                        border-b-2 px-3 sm:px-6 lg:px-8
                        py-3 sm:py-0
                        flex items-center justify-between
                        gap-3
                        sticky top-0 z-30 shadow-sm
                    "
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    {/* LOGO E IDENTIFICAÇÃO */}
                    <div className="flex items-center gap-2 sm:gap-4 min-w-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2 sm:gap-3 group shrink-0"
                        >
                            <div
                                className="
                                    w-9 h-9 sm:w-10 sm:h-10
                                    rounded-xl border-2 border-b-4 p-1
                                    flex items-center justify-center
                                    group-hover:scale-105 transition-transform
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                }}
                            >
                                <img
                                    src="/favicon-quiz.png"
                                    alt="QuizArena"
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            <span className="text-lg sm:text-xl font-black tracking-tight hidden xs:inline">
                                Quiz<span className="text-[#1CB0F6]">Arena</span>
                            </span>
                        </Link>

                        <div
                            className="hidden sm:block h-8 w-[2px] shrink-0"
                            style={{ backgroundColor: colors.border }}
                        />

                        <div className="min-w-0 hidden sm:block">
                            <p
                                className="text-[10px] font-black uppercase tracking-widest"
                                style={{ color: colors.muted }}
                            >
                                QuizArena / Início
                            </p>

                            <h2 className="text-base sm:text-lg font-black truncate">
                                {isHome ? "Página inicial" : "QuizArena"}
                            </h2>
                        </div>
                    </div>

                    {/* AÇÕES */}
                    <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                        {/* CONFIGURAÇÕES */}
                        <button
                            type="button"
                            onClick={() => setShowSettings(true)}
                            aria-label="Abrir configurações"
                            title="Configurações"
                            className="
                                w-10 h-10 sm:w-11 sm:h-11
                                flex items-center justify-center
                                rounded-xl border-2 border-b-4
                                active:border-b-2 active:translate-y-0.5
                                transition-all shrink-0
                            "
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                color: colors.text,
                            }}
                        >
                            <FiSettings size={19} />
                        </button>

                        {!user && (
                            <>
                                {/* LOGIN */}
                                <Link
                                    to="/auth/login"
                                    className="
                                        h-10 sm:h-11
                                        flex items-center justify-center
                                        rounded-xl border-2 border-b-4
                                        px-3 sm:px-4
                                        text-[10px] sm:text-xs font-black
                                        uppercase tracking-wider
                                        transition-all hover:-translate-y-0.5
                                        active:translate-y-0.5 active:border-b-2
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                >
                                    Entrar
                                </Link>

                                {/* CADASTRO */}
                                <Link
                                    to="/auth/register"
                                    className="
                                        h-10 sm:h-11
                                        flex items-center justify-center
                                        rounded-xl border-2 border-b-4
                                        border-[#0092D6] bg-[#1CB0F6]
                                        px-3 sm:px-4
                                        text-[10px] sm:text-xs font-black
                                        uppercase tracking-wider text-white
                                        transition-all hover:-translate-y-0.5
                                        hover:bg-[#00A2ED]
                                        active:translate-y-0.5 active:border-b-2
                                    "
                                >
                                    <span className="hidden sm:inline">
                                        Criar conta
                                    </span>

                                    <span className="sm:hidden">
                                        Cadastrar
                                    </span>
                                </Link>
                            </>
                        )}

                        {/* DASHBOARD */}
                        {user && (
                            <Link
                                to="/dashboard"
                                aria-label="Ir para o dashboard"
                                title="Dashboard"
                                className="
                                    h-10 sm:h-11
                                    flex items-center justify-center gap-2
                                    rounded-xl border-2 border-b-4
                                    border-[#0092D6] bg-[#1CB0F6]
                                    px-3 sm:px-4
                                    text-xs font-black uppercase tracking-wider
                                    text-white transition-all
                                    hover:-translate-y-0.5 hover:bg-[#00A2ED]
                                    active:translate-y-0.5 active:border-b-2
                                "
                            >
                                <FiGrid size={19} />

                                <span className="hidden sm:inline">
                                    Dashboard
                                </span>
                            </Link>
                        )}
                    </div>
                </header>

                {/* CONTEÚDO DAS PÁGINAS */}
                <div className="flex flex-col min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
                    <div className="flex-1 w-full max-w-[1500px] mx-auto min-w-0 px-3 sm:px-6 lg:px-8">
                        <Outlet />
                    </div>

                    {/* FOOTER */}
                    <footer
                        className="border-t-2 mt-auto"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="
                                mx-auto max-w-[1500px]
                                px-4 sm:px-6 lg:px-8 py-5
                                flex flex-col sm:flex-row
                                items-center justify-between gap-3
                            "
                        >
                            <div
                                className="
                                    flex flex-wrap items-center justify-center
                                    gap-2 text-xs font-semibold text-center
                                "
                                style={{ color: colors.muted }}
                            >
                                <FiHome size={15} />
                                <span>QuizArena</span>
                                <span>•</span>
                                <span>Teste seus conhecimentos!</span>
                            </div>

                            {!user && (
                                <Link
                                    to="/auth/register"
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider text-[#1CB0F6]
                                        transition hover:text-[#0092D6]
                                        text-center
                                    "
                                >
                                    Crie sua conta Host
                                </Link>
                            )}
                        </div>
                    </footer>
                </div>
            </main>

            {/* MODAL DE CONFIGURAÇÕES */}
            {showSettings && (
                <div
                    className="
                        fixed inset-0 z-50
                        flex items-center justify-center
                        bg-black/60 p-3 sm:p-4 backdrop-blur-sm
                    "
                    onClick={() => setShowSettings(false)}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="settings-title"
                        className="
                            w-full max-w-md max-h-[90dvh]
                            overflow-y-auto overflow-x-hidden
                            rounded-2xl border-2 border-b-8
                            shadow-2xl
                            animate-in fade-in zoom-in-95 duration-200
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                        onClick={(event) => event.stopPropagation()}
                    >
                        {/* CABEÇALHO */}
                        <div
                            className="
                                flex items-center justify-between
                                border-b-2 p-4 sm:p-5
                                gap-3
                            "
                            style={{ borderColor: colors.border }}
                        >
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <FiSettings
                                        size={20}
                                        style={{ color: colors.primary }}
                                    />

                                    <h2
                                        id="settings-title"
                                        className="text-base sm:text-lg font-black"
                                        style={{ color: colors.text }}
                                    >
                                        Personalização
                                    </h2>
                                </div>

                                <p
                                    className="mt-1 text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Personalize sua experiência no QuizArena.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowSettings(false)}
                                aria-label="Fechar configurações"
                                className="
                                    flex h-9 w-9 sm:h-10 sm:w-10
                                    shrink-0 items-center justify-center
                                    rounded-xl border-2 border-b-4
                                    transition-all
                                    active:translate-y-0.5 active:border-b-2
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.border,
                                    color: colors.text,
                                }}
                            >
                                <FiX size={20} />
                            </button>
                        </div>

                        {/* APARÊNCIA */}
                        <div className="p-4 sm:p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <FiSun
                                    size={18}
                                    className="text-[#E9B949]"
                                />

                                <h3
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider
                                    "
                                    style={{ color: colors.text }}
                                >
                                    Aparência
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {/* TEMA ESCURO */}
                                <button
                                    type="button"
                                    onClick={() => setTheme("darkTheme")}
                                    aria-pressed={theme === "darkTheme"}
                                    className="
                                        rounded-xl border-2 p-3
                                        text-left transition-all
                                        hover:-translate-y-0.5
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor:
                                            theme === "darkTheme"
                                                ? colors.primary
                                                : colors.border,
                                    }}
                                >
                                    <div
                                        className="
                                            mb-3 flex h-16 sm:h-20
                                            items-center justify-center
                                            rounded-xl border-2 border-[#383838]
                                            bg-[#121212]
                                        "
                                    >
                                        <FiMoon
                                            size={28}
                                            className="text-white"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className="text-sm font-black"
                                            style={{ color: colors.text }}
                                        >
                                            Escuro
                                        </span>

                                        {theme === "darkTheme" && (
                                            <span
                                                className="text-[9px] font-black"
                                                style={{ color: colors.primary }}
                                            >
                                                ATIVO
                                            </span>
                                        )}
                                    </div>
                                </button>

                                {/* TEMA CLARO */}
                                <button
                                    type="button"
                                    onClick={() => setTheme("lightTheme")}
                                    aria-pressed={theme === "lightTheme"}
                                    className="
                                        rounded-xl border-2 p-3
                                        text-left transition-all
                                        hover:-translate-y-0.5
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        borderColor:
                                            theme === "lightTheme"
                                                ? colors.primary
                                                : colors.border,
                                    }}
                                >
                                    <div
                                        className="
                                            mb-3 flex h-16 sm:h-20
                                            items-center justify-center
                                            rounded-xl border-2 border-[#E7E4DA]
                                            bg-[#F5F3ED]
                                        "
                                    >
                                        <FiSun
                                            size={28}
                                            className="text-[#E9B949]"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between gap-2">
                                        <span
                                            className="text-sm font-black"
                                            style={{ color: colors.text }}
                                        >
                                            Claro
                                        </span>

                                        {theme === "lightTheme" && (
                                            <span
                                                className="text-[9px] font-black"
                                                style={{ color: colors.primary }}
                                            >
                                                ATIVO
                                            </span>
                                        )}
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* RODAPÉ DO MODAL */}
                        <div
                            className="border-t-2 p-4 sm:p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setShowSettings(false)}
                            >
                                Fechar configurações
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HomeLayout;
