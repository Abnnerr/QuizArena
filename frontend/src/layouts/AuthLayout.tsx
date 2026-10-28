import type React from "react";
import { Link, Outlet } from "react-router";

const AuthLayout: React.FC = () => {


    return (
        <div className="min-h-screen bg-[#FFFFFF] text-[#4B4B4B] flex flex-col justify-between relative overflow-x-hidden select-none font-['Nunito',sans-serif]">
            <div
                className="absolute inset-0 pointer-events-none opacity-25 z-0"
                style={{
                    backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                    backgroundSize: '24px 24px'
                }}
            />
            <header className="w-full border-b-2 border-[#E5E5E5] bg-white py-3 px-4 sm:px-10 flex items-center justify-between relative z-20">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-white rounded-xl border-2 border-[#E5E5E5] border-b-4 p-1 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
                        <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                        QuizArena
                    </span>
                </Link>
            </header>

            <main className="w-full flex-1 flex flex-col items-center justify-center relative z-10 my-auto">
                <Outlet />
            </main>
            <footer className="w-full border-t-2 flex justify-center border-[#E5E5E5] bg-white py-4 px-4 sm:px-10 relative z-20">
                <p className="text-xs sm:text-sm font-black text-[#AFAFAF] flex items-center justify-center sm:justify-start gap-1.5">
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