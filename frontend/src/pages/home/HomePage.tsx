import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router';
import { BiHash } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { FaGamepad } from 'react-icons/fa';
import { AXIOS } from '../../service';
import type { ResponseDTO } from '../../contexts/types/authTypes';
import { useAuth } from '../../contexts/hooks/useAuth';

const HomePage: React.FC = () => {
    const { user } = useAuth();
    const [roomCode, setRoomCode] = useState<string>('');
    const [feedBack, setFeedBack] = useState<ResponseDTO | null>(null);

    const navigate = useNavigate();

    async function handleJoinRoom(e: React.FormEvent) {
        e.preventDefault();

        try {
            const { data } = await AXIOS.get(`/room/${roomCode}`);
            setFeedBack({
                type: "Success",
                message: "Sala Encontrada!"
            });

            if (data.type === 'Success' && user?.role_name === "host") {
                setTimeout(() => {
                    navigate(`/room/${roomCode}/lobby`);
                }, 1500);
                return;
            }
            setTimeout(() => {
                navigate(`/room/player/username/${roomCode}`);
            }, 1500);
        } catch (error: any) {
            setFeedBack({
                type: "Warning",
                message: error.response?.data?.message || "Erro ao encontrar a sala ou não existe."
            });
            setTimeout(() => {
                setFeedBack(null)
            }, 2000);
        }
    }

    return (
        <>
            <Helmet>
                <title>Entrar na Sala | QuizArena</title>
            </Helmet>

            <main className="min-h-screen bg-[#121212] text-[#F3F4F6] font-['Nunito',sans-serif] flex flex-col relative overflow-x-hidden select-none outline-none justify-center">
                {/* Background Dot Pattern Ajustado para Dark Mode */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(#383838 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="w-full flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto relative z-10">
                    <div className="w-full h-20">
                        {feedBack && (
                            <div
                                className={`w-full mb-6 p-4 rounded-2xl text-sm font-black text-center border-2 border-b-4 flex items-center justify-center gap-2 animate-bounce-short ${feedBack.type === 'Success'
                                        ? 'bg-[#15320F] border-[#58CC02] text-[#8BEA44]'
                                        : feedBack.type === 'Warning'
                                            ? 'bg-[#3A320A] border-[#FFC800] text-[#FFD966]'
                                            : 'bg-[#3B1515] border-[#FF4B4B] text-[#FF6B6B]'
                                    }`}
                            >
                                <span>{feedBack.message}</span>
                            </div>
                        )}
                    </div>

                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#1E1E1E] rounded-3xl border-2 border-[#2A2A2A] border-b-8 p-3 shadow-lg flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                            <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain filter drop-shadow" />
                        </div>
                        <div className="relative bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-lg w-full sm:w-auto">
                            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#2A2A2A]" />
                            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-[#1E1E1E]" />

                            <h2 className="text-xl sm:text-2xl font-black text-[#F3F4F6] tracking-tight">
                                Pronto para a disputa?
                            </h2>
                            <p className="text-[#AAAAAA] text-xs sm:text-sm font-extrabold mt-1">
                                Digite o código da sala para entrar na partida agora!
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleJoinRoom} className="w-full space-y-6">
                        <div className={`bg-[#1E1E1E] border-2 ${feedBack?.type === 'Warning' ? "border-[#FF4B4B]" : "border-[#2A2A2A]"} duration-700 border-b-8 rounded-3xl p-6 sm:p-8 shadow-lg`}>
                            <label className="block text-xs font-black uppercase tracking-widest text-[#888888] mb-3 text-center">
                                Código da Sala
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#FFC800] z-10">
                                    <BiHash className="w-7 h-7 text-[#FFC800]" />
                                </div>

                                <input
                                    type="text"
                                    required
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                    placeholder="ARENA123"
                                    maxLength={12}
                                    className="w-full bg-[#151515] border-2 border-[#2A2A2A] border-b-4 rounded-2xl pl-12 pr-4 py-4 text-[#F3F4F6] font-black tracking-widest text-center text-2xl sm:text-3xl placeholder:text-[#444444] focus:outline-none focus:border-[#1CB0F6] focus:bg-[#1A1A1A] focus:border-b-4 transition-all uppercase"
                                />
                            </div>

                            <div className="mt-3 text-right">
                                <span className="text-xs font-black text-[#888888]">
                                    {roomCode.length}/12
                                </span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={!roomCode.trim()}
                            className="w-full h-15 bg-[#58CC02] hover:bg-[#61E002] text-white font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm uppercase tracking-wider border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#222222] disabled:border-[#2F2F2F] disabled:text-[#666666] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                        >
                            <FaGamepad className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span>Entrar na Sala</span>
                            <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
};

export default HomePage;