import { Link, Outlet } from "react-router";

const RoomLayout = () => {
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

            <main className="w-full flex-1 flex flex-col relative z-10">
                <Outlet />
            </main>

            <footer className="w-full border-t-2 border-[#E5E5E5] bg-white p-4 sm:px-10 relative z-20">
                <div className="max-w-xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4">

                    <div className="text-center sm:text-left text-xs sm:text-sm font-black text-[#AFAFAF]">
                        <p>© 2026 QuizArena</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default RoomLayout;