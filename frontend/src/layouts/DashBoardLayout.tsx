
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import {
    FiGrid,
    FiBookOpen,
    FiHelpCircle,
    FiUsers,
    FiSettings,
    FiMenu,
    FiX,
} from "react-icons/fi";

import { useAuth } from "../contexts/hooks/useAuth";
import { useTheme } from "../contexts/hooks/useTheme";

const DashBoardLayout: React.FC = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = [
        { name: "Visão geral", icon: FiGrid, path: "/dashboard" },
        { name: "Bibliotecas", icon: FiBookOpen, path: "/dashboard/library" },
        { name: "Minhas perguntas", icon: FiHelpCircle, path: "/dashboard/categories" },
        { name: "Minhas salas", icon: FiUsers, path: "/dashboard/rooms" },
    ];

    const initial = user?.user_username?.charAt(0)?.toUpperCase() || "U";

    const closeMenu = () => setMenuOpen(false);

    const sidebarContent = (
        <>
            <div
                className="h-20 shrink-0 flex items-center justify-between px-5 sm:px-6 border-b-2"
                style={{ borderColor: colors.border }}
            >
                <Link
                    to="/"
                    onClick={closeMenu}
                    className="flex items-center gap-3 group"
                >
                    <div
                        className="w-10 h-10 rounded-xl border-2 border-b-4 p-1 flex items-center justify-center group-hover:scale-105 transition-transform"
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

                    <span className="text-xl font-black tracking-tight">
                        Quiz<span className="text-[#1CB0F6]">Arena</span>
                    </span>
                </Link>

                <button
                    onClick={closeMenu}
                    className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl"
                    aria-label="Fechar menu"
                >
                    <FiX size={23} />
                </button>
            </div>

            <div className="p-4 flex-1 overflow-y-auto">
                <p
                    className="text-[11px] uppercase tracking-widest font-black px-3 mb-4"
                    style={{ color: colors.muted }}
                >
                    Menu principal
                </p>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                end={item.path === "/dashboard"}
                                onClick={closeMenu}
                                className="flex items-center gap-3 px-4 min-h-13 py-3 rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black text-sm"
                                style={({ isActive }) => ({
                                    backgroundColor: isActive
                                        ? "#1CB0F6"
                                        : colors.surface,
                                    borderColor: isActive
                                        ? "#0092D6"
                                        : colors.border,
                                    color: isActive
                                        ? "#FFFFFF"
                                        : colors.text,
                                })}
                            >
                                <Icon size={19} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                <p
                    className="text-[11px] uppercase tracking-widest font-black px-3 mt-9 mb-4"
                    style={{ color: colors.muted }}
                >
                    Preferências
                </p>

                <NavLink
                    to="/dashboard/config"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black text-sm"
                    style={({ isActive }) => ({
                        backgroundColor: isActive
                            ? "#1CB0F6"
                            : colors.surface,
                        borderColor: isActive
                            ? "#0092D6"
                            : colors.border,
                        color: isActive
                            ? "#FFFFFF"
                            : colors.text,
                    })}
                >
                    <FiSettings size={19} />
                    Configurações
                </NavLink>
            </div>

            <div
                className="p-4 shrink-0 border-t-2"
                style={{ borderColor: colors.border }}
            >
                <div
                    className="rounded-2xl border-2 border-b-4 p-3 flex items-center gap-3"
                    style={{
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    }}
                >
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center font-black">
                        {initial}
                    </div>

                    <div className="min-w-0">
                        <p className="font-black text-sm truncate">
                            {user?.user_username || "Minha conta"}
                        </p>

                        <p
                            className="text-xs font-bold"
                            style={{ color: colors.muted }}
                        >
                            QuizArena
                        </p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <div
            className="min-h-screen flex"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            {/* Sidebar desktop */}
            <aside
                className="hidden lg:flex w-64 shrink-0 flex-col border-r-2 min-h-screen sticky top-0 h-screen"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                {sidebarContent}
            </aside>

            {/* Menu mobile */}
            {menuOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <button
                        type="button"
                        aria-label="Fechar menu"
                        onClick={closeMenu}
                        className="absolute inset-0 bg-black/50"
                    />

                    <aside
                        className="relative w-[min(280px,85vw)] h-full flex flex-col border-r-2 shadow-xl animate-in slide-in-from-left duration-200"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        {sidebarContent}
                    </aside>
                </div>
            )}

            <main className="flex-1 min-w-0">
                <header
                    className="min-h-20 border-b-2 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-sm"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <button
                            onClick={() => setMenuOpen(true)}
                            className="lg:hidden w-10 h-10 shrink-0 flex items-center justify-center rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            }}
                            aria-label="Abrir menu"
                        >
                            <FiMenu size={21} />
                        </button>

                        <div className="min-w-0">
                            <p
                                className="text-[10px] sm:text-xs font-black uppercase tracking-widest truncate"
                                style={{ color: colors.muted }}
                            >
                                QuizArena / Dashboard
                            </p>

                            <h2 className="text-base sm:text-lg font-black truncate">
                                Painel de controle
                            </h2>
                        </div>
                    </div>

                    <Link
                        to="/dashboard/user"
                        aria-label="Meu perfil"
                        className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black bg-[#1CB0F6] text-white"
                        style={{ borderColor: "#0092D6" }}
                    >
                        {initial}
                    </Link>
                </header>

                <div className="w-full max-w-[1500px] mx-auto p-3 sm:p-5 md:p-7 lg:p-9">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashBoardLayout;
