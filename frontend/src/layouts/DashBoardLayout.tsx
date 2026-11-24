
import { Link, NavLink, Outlet } from "react-router";
import { useAuth } from "../contexts/hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

import {
    FiGrid,
    FiBookOpen,
    FiHelpCircle,
    FiUsers,
    FiSettings,

} from "react-icons/fi";

const DashBoardLayout: React.FC = () => {
    const { user } = useAuth();
    const { colors } = useTheme();

    const menuItems = [
        { name: "Visão geral", icon: FiGrid, path: "/dashboard" },
        { name: "Bibliotecas", icon: FiBookOpen, path: "/dashboard/library", },
        { name: "Minhas perguntas", icon: FiHelpCircle, path: "/dashboard/categories", },
        { name: "Minhas salas", icon: FiUsers, path: "/dashboard/rooms" },
    ];


    return (
        <div
            className="min-h-screen flex"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            <aside
                className="hidden lg:flex w-64 shrink-0 flex-col border-r-2 min-h-screen sticky top-0 h-screen"
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <div
                    className="h-20 flex items-center px-6 border-b-2"
                    style={{ borderColor: colors.border }}
                >
                    <Link to="/" className="flex items-center gap-3 group">
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
                </div>
                <div className="p-4 flex-1">
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
                                    className="flex items-center gap-3 px-4 h-13 py-3 rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black text-sm"
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

                    <Link
                        to="/dashboard/config"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black text-sm"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                            color: colors.text,
                        }}
                    >
                        <FiSettings size={19} />
                        Configurações
                    </Link>
                </div>
                <div
                    className="p-4 border-t-2"
                    style={{ borderColor: colors.border }}
                >
                    <div
                        className="rounded-2xl border-2 border-b-4 p-3 flex items-center gap-3"
                        style={{
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="w-10 h-10 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center font-black">
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                            <p className="font-black text-sm truncate">
                                {user?.name || "Minha conta"}
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
            </aside>
            <main className="flex-1 min-w-0">
                <header
                    className="h-20 border-b-2 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div>
                        <p
                            className="text-[10px] font-black uppercase tracking-widest"
                            style={{ color: colors.muted }}
                        >
                            QuizArena / Dashboard
                        </p>
                        <h2 className="text-lg font-black">
                            Painel de controle
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">

                        <Link
                            to="/auth/user"
                            className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-b-4 active:border-b-2 active:translate-y-0.5 transition-all font-black bg-[#1CB0F6] text-white"
                            style={{ borderColor: "#0092D6" }}
                        >
                            {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </Link>
                    </div>
                </header>
                <div className="p-4 sm:p-7 lg:p-9 max-w-[1500px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default DashBoardLayout;
