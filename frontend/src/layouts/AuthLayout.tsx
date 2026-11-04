import type React from "react";
import { Link, Outlet } from "react-router";

const AuthLayout: React.FC = () => {


    return (
        <div className="min-h-screen bg-[#121212] text-[#F3F4F6] flex flex-col justify-between relative overflow-x-hidden select-none font-['Nunito',sans-serif]">
            {/* Background Dot Pattern para Dark Mode */}
            <div
                className="absolute inset-0 pointer-events-none opacity-15 z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(#383838 2px, transparent 2px)",
                    backgroundSize: "24px 24px",
                }}
            />

            {/* Header com fundo escuro e borda discreta */}
            <header className="w-full border-b-2 border-[#2A2A2A] bg-[#1E1E1E] py-3 px-4 sm:px-10 flex items-center justify-between relative z-20 shadow-md">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#282828] rounded-xl border-2 border-[#333333] border-b-4 p-1 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
                        <img
                            src="/favicon-quiz.png"
                            alt="QuizArena"
                            className="h-full w-full object-contain filter drop-shadow"
                        />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#F3F4F6] tracking-tight">
                        Quiz<span className="text-[#1CB0F6]">Arena</span>
                    </span>
                </Link>
            </header>

            {/* Conteúdo Principal Centralizado */}
            <main className="w-full flex-1 flex flex-col items-center justify-center relative z-10 my-auto">
                <Outlet />
            </main>

            {/* Rodapé Escuro */}
            <footer className="w-full border-t-2 flex justify-center border-[#2A2A2A] bg-[#1E1E1E] py-4 px-4 sm:px-10 relative z-20">
                <p className="text-xs sm:text-sm font-black text-[#888888] flex items-center justify-center sm:justify-start gap-1.5">
                    <span>© {new Date().getFullYear()} QuizArena —</span>
                    <span className="text-[#FF4B4B]">Aprenda</span> •
                    <span className="text-[#FFC800]">Jogue</span> •
                    <span className="text-[#1CB0F6]">Vença</span>
                </p>
            </footer>
        </div>
    );
};

export default AuthLayout;