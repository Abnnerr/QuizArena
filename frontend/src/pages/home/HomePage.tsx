import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router';
import { BiHash } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { FaGamepad } from 'react-icons/fa';
import { AXIOS } from '../../service';
import type { ResponseDTO } from '../../contexts/types/authTypes';


const HomePage: React.FC = () => {
    const [roomCode, setRoomCode] = useState<string>('');
    const [feedBack, setFeedBack] = useState<ResponseDTO | null>(null)

    const navigate = useNavigate();

    async function handleJoinRoom(e: React.FormEvent) {
        e.preventDefault();

        try {
            const { data } = await AXIOS.post(`/room/join`, { name: roomCode })

            if (data.type === 'Success') {
                setFeedBack({
                    type: "Success",
                    message: "Sala Encontrada"
                })

                setTimeout(() => {
                    navigate(`/room/${roomCode.trim().toUpperCase()}`);
                }, 2000);
            }
        } catch (error) {
            setFeedBack({
                type: "Warning",
                message: error.response?.data?.message || "Erro ao encontrar a sala ou nao existe"
            })
        }

    };

    return (
        <>
            <Helmet>
                <title>QuizArena</title>
            </Helmet>
        
                <div className="w-full max-w-md relative z-10 my-auto">
                    <div className="text-center mb-8 items-center flex flex-col">
                        <img src="/favicon-quiz.png" alt="" className='h-20 w-20' />
                        <p className="text-zinc-300 text-sm sm:text-base font-semibold mt-4">
                            Digite nome da sala para entrar na partida!
                        </p>
                    </div>
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative">
                        <form onSubmit={handleJoinRoom} className="space-y-4">
                            {feedBack && (
                                <div
                                    className={`mb-4 p-3 rounded-2xl text-xs font-bold text-center border-2 ${feedBack.type === 'Success'
                                        ? 'bg-[#26890C]/20 border-[#26890C] text-green-300'
                                        : feedBack.type === 'Warning'
                                            ? 'bg-[#D89E00]/20 border-[#D89E00] text-amber-300'
                                            : 'bg-[#E21B3C]/20 border-[#E21B3C] text-red-300'
                                        }`}
                                >
                                    {feedBack.message}
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-2 text-center">
                                    Nome da Sala
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-400">
                                        <BiHash className="w-6 h-6 text-amber-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={roomCode}
                                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                                        placeholder="Ex: ARENA123"
                                        maxLength={12}
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white font-black tracking-widest text-center text-xl placeholder-zinc-500 focus:outline-none focus:border-[#26890C] focus:bg-black/60 transition-all uppercase"
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!roomCode.trim()}
                                className="w-full mt-2 bg-[#26890C] hover:bg-[#2cb20d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer"
                            >
                                <FaGamepad className="w-5 h-5" />
                                <span>Entrar na Sala</span>
                                <BsArrowRight className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                    <div className="mt-8 text-center text-xs font-bold text-zinc-400">
                        Quer criar seu próprio Quiz?{' '}
                        <Link
                            to="/auth/register"
                            className="text-amber-400 hover:text-amber-300 font-extrabold underline underline-offset-4 transition-colors"
                        >
                            Crie uma conta de Host
                        </Link>
                    </div>
                </div>
        </>
    );
};

export default HomePage;