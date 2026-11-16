import { Link, Outlet } from "react-router";
import { useTheme } from "../contexts/ThemeContext";

const RoomLayout = () => {
    const { colors } = useTheme();

    return (
        <>
            {/* HEADER */}
            <header
                className="
                       w-full border-b-2
                       py-3 px-4 sm:px-10
                       flex items-center justify-between
                       relative z-20 shadow-md
                   "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <Link to="/" className="flex items-center gap-3 group">
                    <div
                        className="
                               w-10 h-10 p-1
                               rounded-xl border-2 border-b-4
                               shadow-sm flex items-center justify-center
                               transition-transform group-hover:scale-105
                           "
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
                        className="text-xl sm:text-2xl font-black tracking-tight"
                        style={{ color: colors.text }}
                    >
                        Quiz<span style={{ color: colors.primary }}>Arena</span>
                    </span>
                </Link>
            </header>

            {/* CONTEÚDO */}
            <div className="flex-1 min-h-0 w-full overflow-y-auto overflow-x-hidden">
                <Outlet />
            </div>

            {/* FOOTER */}
            <footer
                className="
                       w-full border-t-2
                       py-4 px-4 sm:px-10
                       flex justify-center
                       relative z-20
                   "
                style={{
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                }}
            >
                <p
                    className="
                           text-xs sm:text-sm font-black
                           flex items-center justify-center
                           gap-1.5 text-center flex-wrap
                       "
                    style={{ color: colors.muted }}
                >
                    <span>© {new Date().getFullYear()} QuizArena </span>
                </p>
            </footer>
        </>
    );
};

export default RoomLayout;
