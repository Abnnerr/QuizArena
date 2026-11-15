
import { Link, Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

const RoomLayout = () => {
    const { colors } = useTheme();

    return (
        <div
            className="
                h-dvh w-full
                flex flex-col relative
                overflow-hidden
                select-none
                font-['Nunito',sans-serif]
            "
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            {/* HEADER FIXO */}
            <header
                className="
                    w-full shrink-0
                    border-b-2
                    py-3 px-4 sm:px-10
                    flex items-center justify-between
                    relative z-20
                "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <Link to="/" className="flex items-center gap-3 group">
                    <div
                        className="
                            w-10 h-10 rounded-xl
                            border-2 border-b-4
                            p-1 shadow-sm
                            flex items-center justify-center
                            transition-transform group-hover:scale-105
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <img
                            src="/favicon-quiz.png"
                            alt="QuizArena"
                            className="h-full w-full object-contain"
                        />
                    </div>

                    <span
                        className="text-xl sm:text-2xl font-black tracking-tight"
                        style={{ color: colors.text }}
                    >
                        QuizArena
                    </span>
                </Link>
            </header>

            {/* CONTEÚDO COM SCROLL */}
            <main
                className="
                    w-full flex-1 min-h-0
                    relative z-10
                    overflow-y-auto overflow-x-hidden
                "
            >
                <Outlet />
            </main>

            {/* FOOTER FIXO */}
            <footer
                className="
                    w-full shrink-0
                    border-t-2
                    p-4 sm:px-10
                    relative z-20
                "
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
                        <p>© 2026 QuizArena</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default RoomLayout;
