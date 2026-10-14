import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";

const RoomStartPage = () => {
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();
    const [count, setCount] = useState(3);

    useEffect(() => {
        if (count === 0) {
            const timer = setTimeout(() => {
                navigate(`/room/${roomCode}/live`);
            }, 50);

            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCount((prev) => prev - 1);
        }, 2000);

        return () => clearTimeout(timer);
    }, [count, roomCode, navigate]);

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida Iniciando</title>
            </Helmet>

            <main className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <div className="absolute w-96 h-96 bg-[#1368CE]/15 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-center">
                    {count > 0 && (
                        <span
                            key={count}
                            className="countdown-number text-[12rem] sm:text-[18rem] font-black tracking-tighter text-[#D89E00] drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
                        >
                            {count}
                        </span>
                    )}
                </div>
            </main>
        </>
    );
};

export default RoomStartPage;