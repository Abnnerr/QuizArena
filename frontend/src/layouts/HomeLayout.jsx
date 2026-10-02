import { FaGamepad, FaPlusCircle, FaShieldAlt } from "react-icons/fa";
import { Outlet } from "react-router";

const HomeLayout = () => {
    return (
        <>
            <header className="w-full p-4 sm:p-6 flex justify-between items-center z-10">
                <div className="flex items-center space-x-2">
                    <div className="bg-white p-2.5 rounded-2xl shadow-md transform -rotate-3 hover:rotate-0 transition-transform cursor-pointer">
                        <FaGamepad className="w-8 h-8 text-[#46178f]" />
                    </div>
                    <span className="text-white font-black tracking-wider text-2xl sm:text-3xl drop-shadow-md font-mono">
                        KAHOOT!
                    </span>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => alert('Modo Criador: Redirecionando para criar quiz...')}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-full border-2 border-white/20 transition-all shadow-sm flex items-center space-x-2 cursor-pointer"
                    >
                        <FaPlusCircle />
                        <span className="hidden sm:inline">Criar Quiz</span>
                    </button>
                    <button
                        onClick={() => alert('Redirecionando para a página de Login...')}
                        className="bg-white text-[#46178f] hover:bg-gray-100 text-sm font-black px-5 py-2.5 rounded-full shadow-md transition-transform active:scale-95 cursor-pointer"
                    >
                        Entrar
                    </button>
                </div>
            </header>
            <Outlet />
            <footer className="w-full p-4 text-center text-white/60 text-xs font-semibold z-10 flex flex-col sm:flex-row justify-center items-center gap-2">
                <span>© 2026 Kahoot! Style Home • Feito com React, Tailwind & React Icons</span>
                <span className="hidden sm:inline">•</span>
                <div className="flex items-center space-x-1 text-white/80">
                    <FaShieldAlt className="w-4 h-4" />
                    <span>Seguro & Verificado</span>
                </div>
            </footer>
        </>
    );
}

export default HomeLayout;