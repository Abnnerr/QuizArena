import type React from "react";
import { Link, Outlet } from "react-router";
import { useAuth } from "../contexts/hooks/useAuth";

const HomeLayout: React.FC = () => {
    const { user } = useAuth()
    return (
        <div className="min-h-screen bg-[#13092E] text-white flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
            <div className="absolute top-12 -left-12 w-56 h-56 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 -right-12 w-72 h-72 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 right-10 w-44 h-44 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-3xl pointer-events-none" />
            <div className="absolute bottom-12 left-10 w-52 h-52 bg-[#26890C]/15 -rotate-12 rounded-full blur-3xl pointer-events-none" />

            <header className="absolute top-6 right-6 z-20 flex items-center gap-3">
                {
                    !user && (
                        <Link
                            to="/auth/login"
                            className="bg-white/10 hover:bg-white/20 text-white font-extrabold px-4 py-2 rounded-2xl text-xs uppercase tracking-wider transition-all border border-white/10 backdrop-blur-md"
                        >
                            Entrar
                        </Link>
                    )}
                {
                    !user && (
                        <Link
                            to="/auth/register"
                            className="bg-[#1368CE] hover:bg-[#1a76e8] text-white font-extrabold px-4 py-2 rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#0E4B94] active:shadow-none active:translate-y-1 transition-all"
                        >
                            Criar Conta
                        </Link>
                    )
                }
                {
                    user && (
                        <Link
                            to="/room/create"
                            className="bg-[#1368CE] hover:bg-[#1a76e8] text-white font-extrabold px-4 py-2 rounded-2xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#0E4B94] active:shadow-none active:translate-y-1 transition-all"
                        >
                            Criar Sala
                        </Link>
                    )
                }
            </header>
            <Outlet />
        </div>
    );
}

export default HomeLayout;