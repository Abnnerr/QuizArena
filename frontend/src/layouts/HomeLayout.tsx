import type React from "react";
import { Link, Outlet } from "react-router";
import { useAuth } from "../contexts/hooks/useAuth";

const HomeLayout: React.FC = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#121212] text-[#F3F4F6] flex flex-col justify-between relative overflow-x-hidden select-none font-['Nunito',sans-serif]">
            <div
                className="absolute inset-0 pointer-events-none opacity-15 z-0"
                style={{
                    backgroundImage:
                        "radial-gradient(#383838 2px, transparent 2px)",
                    backgroundSize: "24px 24px",
                }}
            />
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

                <div className="flex items-center gap-3">
                    {!user && (
                        <>
                            <Link
                                to="/auth/login"
                                className="bg-[#282828] h-11 flex items-center justify-center hover:bg-[#333333] text-[#F3F4F6] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-2 border-[#3A3A3A] border-b-4 active:border-b-2 active:translate-y-0.5 transition-all"
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
            <main className="w-full flex-1 flex flex-col relative z-10">
                <Outlet />
            </main>
            <footer className="w-full border-t-2 border-[#2A2A2A] bg-[#1E1E1E] py-4 px-4 sm:px-10 relative z-20">
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">
                    <div className="text-center sm:text-left text-xs sm:text-sm font-black text-[#888888]">
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
        </div>
    );
};

export default HomeLayout;