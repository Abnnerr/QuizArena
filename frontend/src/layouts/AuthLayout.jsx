import { Outlet, useNavigate } from "react-router";
import {
    FaGamepad,
    FaPlusCircle,
    FaShieldAlt,
} from "react-icons/fa";

const HomeLayout = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#46178f] flex flex-col relative overflow-hidden font-sans">
            <div className="absolute top-12 left-12 w-28 h-28 bg-[#1368ce] rounded-3xl rotate-12 opacity-80 animate-bounce hidden sm:block shadow-lg" />
            <div className="absolute bottom-20 right-20 w-36 h-36 bg-[#e21b3c] rounded-full opacity-80 animate-pulse hidden sm:block shadow-lg" />
            <div className="absolute top-1/3 right-16 w-24 h-24 bg-[#ffa602] rotate-45 rounded-2xl opacity-80 hidden md:block shadow-lg" />
            <div className="absolute bottom-1/4 left-20 w-32 h-32 bg-[#26890c] rounded-3xl -rotate-12 opacity-80 hidden md:block shadow-lg" />
            <header className="w-full p-4 sm:p-6 flex justify-between items-center z-10">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <div className="bg-white p-2.5 rounded-2xl shadow-md transform -rotate-3 hover:rotate-0 transition-transform">
                        <FaGamepad className="w-8 h-8 text-[#46178f]" />
                    </div>

                    <span className="text-white font-black tracking-wider text-2xl sm:text-3xl drop-shadow-md font-mono">
                        QuizArena
                    </span>
                </button>
                <div className="flex items-center space-x-3">

                    <button
                        onClick={() => navigate("/quiz/create")}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-full border-2 border-white/20 transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                    >
                        <FaPlusCircle />

                        <span className="hidden sm:inline">
                            Criar Quiz
                        </span>
                    </button>

                    <button
                        onClick={() => navigate("/auth/login")}
                        className="bg-white text-[#46178f] hover:bg-gray-100 text-sm font-black px-5 py-2.5 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                        Entrar
                    </button>

                </div>
            </header>
            <main className="flex-1 flex items-center justify-center p-4 z-10">
                <Outlet />
            </main>
            <footer className="w-full p-4 text-center text-white/60 text-xs font-semibold z-10 flex flex-col sm:flex-row justify-center items-center gap-2">

                <span>
                    © 2026 QuizArena
                </span>

                <span className="hidden sm:inline">
                    •
                </span>

                <div className="flex items-center space-x-1 text-white/80">
                    <FaShieldAlt className="w-4 h-4" />

                    <span>
                        Seguro & Verificado
                    </span>
                </div>

            </footer>

        </div>
    );
};

export default HomeLayout;
