import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";

const RoomStartPage = () => {
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();
    const [count, setCount] = useState(5);

    useEffect(() => {
        if (count === 0) {
            const timer = setTimeout(() => {
                navigate(`/room/${roomCode}/live`);
            }, 800); 

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 1200);

        return () => clearTimeout(timer);
    }, [count, roomCode, navigate]);

   
    const getCountdownStyle = () => {
        switch (count) {
            case 3:
                return {
                    color: "text-[#FF4B4B]",
                    borderColor: "border-[#FF4B4B]",
                    bgBadge: "bg-[#FFD2D2]",
                    textBadge: "text-[#A80000]",
                    label: "Prepare-se!",
                };
            case 2:
                return {
                    color: "text-[#FFC800]",
                    borderColor: "border-[#FFC800]",
                    bgBadge: "bg-[#FFFBF0]",
                    textBadge: "text-[#7A5B00]",
                    label: "Atenção...",
                };
            case 1:
                return {
                    color: "text-[#1CB0F6]",
                    borderColor: "border-[#1CB0F6]",
                    bgBadge: "bg-[#E8F7FE]",
                    textBadge: "text-[#0092D6]",
                    label: "Vai começar!",
                };
            default:
                return {
                    color: "text-[#58CC02]",
                    borderColor: "border-[#58CC02]",
                    bgBadge: "bg-[#D7FFB8]",
                    textBadge: "text-[#2B7200]",
                    label: "VALENDO!",
                };
        }
    };

    const currentStyle = getCountdownStyle();

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida Iniciando</title>
            </Helmet>

            <main className="min-h-screen bg-[#FFFFFF] text-[#4B4B4B] flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div
                    className="absolute inset-0 pointer-events-none opacity-25 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

                <div className="w-full max-w-lg relative z-10 flex flex-col items-center text-center space-y-6 my-auto">
                    <div className={`inline-flex items-center gap-2 font-black px-5 py-2 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-2 border-b-4 transition-all duration-300 shadow-sm ${currentStyle.bgBadge} ${currentStyle.borderColor} ${currentStyle.textBadge}`}>
                        <span>{currentStyle.label}</span>
                    </div>
                    <div className="w-full bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-8 sm:p-12 shadow-sm flex flex-col items-center justify-center min-h-[280px] sm:min-h-[340px] relative">
                        <div key={count} className="animate-bounce-short my-auto">
                            {count > 0 ? (
                                <span className={`text-[9rem] sm:text-[13rem] font-black leading-none tracking-tighter ${currentStyle.color} drop-shadow-sm`}>
                                    {count}
                                </span>
                            ) : (
                                <span className="text-4xl sm:text-6xl font-black text-[#58CC02] tracking-wider uppercase animate-pulse">
                                    VALENDO!
                                </span>
                            )}
                        </div>

                        <p className="text-xs sm:text-sm font-black text-[#AFAFAF] uppercase tracking-widest mt-2">
                            {count > 0 ? "A partida está prestes a começar..." : "Boa sorte!"}
                        </p>
                    </div>

                </div>
            </main>
        </>
    );
};

export default RoomStartPage;