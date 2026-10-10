import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import { BiUser, BiCrown, BiCopy, BiCheck } from 'react-icons/bi';
import { BsPlayFill, BsArrowLeft, BsShieldCheck } from 'react-icons/bs';
import { useLobby } from '../hooks/useLobby'; // Ajuste o caminho se necessário
import { useAuth } from '../../../contexts/hooks/useAuth';

const RoomLobbyPage: React.FC = () => {
    const { user } = useAuth()
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const [copied, setCopied] = useState(false);

    const {
        room,
        loading,
        starting,
        error,
        toggleReady,
        startGame
    } = useLobby({ roomId });

    const handleCopyCode = () => {
        if (room?.code) {
            navigator.clipboard.writeText(room.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Sala de Espera</title>
            </Helmet>

            <div className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                {/* Background Glow Effects */}
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10">

                    {/* Header Top Bar */}
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 bg-[#1E1145]/80 hover:bg-[#1E1145] border-2 border-white/10 text-zinc-300 hover:text-white font-extrabold px-4 py-2 rounded-2xl text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
                        >
                            <BsArrowLeft className="w-4 h-4" />
                            <span>Voltar</span>
                        </button>

                        <div className="inline-flex items-center gap-2 bg-[#1368CE] text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase shadow-[0_4px_0_0_#0E4B94]">
                            Sala de Espera
                        </div>
                    </div>

                    {/* Logo Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md mb-2">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">Quiz</span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">Arena</span>
                        </h1>
                        <p className="text-zinc-300 font-bold text-sm">
                            {room ? room.name : 'Carregando sala...'}
                        </p>
                    </div>

                    {/* Main Lobby Card */}
                    <div className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative space-y-6">

                        {/* Error Message Feedback */}
                        {error && (
                            <div className="bg-[#E21B3C]/20 border-2 border-[#E21B3C]/40 text-red-200 p-3 rounded-2xl text-xs font-bold text-center">
                                {error}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="inline-block w-8 h-8 border-4 border-[#1368CE] border-t-transparent rounded-full animate-spin" />
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider">Conectando à sala...</p>
                            </div>
                        ) : room ? (
                            <>
                                {/* Room Code & Mode Banner */}
                                <div className="flex flex-col sm:flex-row items-center justify-between bg-black/40 border-2 border-white/10 rounded-2xl p-4 gap-4">
                                    <div>
                                        <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">Código da Sala</span>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xl sm:text-2xl font-black tracking-wider text-[#D89E00]">{room.code}</span>
                                            <span className="bg-white/10 text-zinc-300 px-2 py-0.5 rounded-lg text-[10px] font-extrabold uppercase">
                                                {room.mode}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCopyCode}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D89E00] hover:bg-[#e6a800] text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#997000] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                                    >
                                        {copied ? <BiCheck className="w-4 h-4" /> : <BiCopy className="w-4 h-4" />}
                                        <span>{copied ? 'Copiado!' : 'Copiar Código'}</span>
                                    </button>
                                </div>

                                {/* Players Grid Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                                            <BiUser className="w-4 h-4 text-cyan-400" />
                                            <span>Jogadores ({room.players.length}/{room.maxPlayers})</span>
                                        </h2>
                                        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                            Prontos: {room.players.filter(p => p.isReady).length}/{room.players.length}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                        {room.players.map((player) => (
                                            <div
                                                key={player.id}
                                                className="bg-black/30 border-2 border-white/10 rounded-2xl p-3 flex items-center justify-between transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shadow-inner font-black text-cyan-300">
                                                        {player.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-1.5">
                                                            <span className="font-extrabold text-sm text-white">{player.username}</span>
                                                            {player.isHost && (
                                                                <span className="bg-[#D89E00]/20 text-[#D89E00] border border-[#D89E00]/30 px-1.5 py-0.2 rounded text-[10px] font-black uppercase flex items-center gap-0.5">
                                                                    <BiCrown className="w-3 h-3" /> Host
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className={`text-[11px] font-bold ${player.isReady ? 'text-emerald-400' : 'text-amber-400'}`}>
                                                            {player.isReady ? '● Pronto' : '○ Aguardando'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {player.isReady && (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                        <BiCheck className="w-4 h-4" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2">
                                    {user.role_name === 'host' ? (
                                        <button
                                            onClick={startGame}
                                            disabled={starting}
                                            className="w-full bg-[#26890C] hover:bg-[#2cb20d] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-[0_5px_0_0_#1a5c08] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer"
                                        >
                                            <span>{starting ? 'Iniciando...' : 'Iniciar Partida'}</span>
                                            <BsPlayFill className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={toggleReady}
                                            className="w-full bg-[#1368CE] hover:bg-[#1875e9] text-white font-black py-4 rounded-2xl shadow-[0_5px_0_0_#0E4B94] active:shadow-none active:translate-y-1 transition-all duration-150 flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer"
                                        >
                                            <span>Alternar Status (Pronto / Não Pronto)</span>
                                            <BsShieldCheck className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>

                                {/* Footer Info */}
                                <div className="text-center text-xs font-bold text-zinc-400">
                                    {user.role_name === 'host' ? 'Você é o organizador desta sala.' : 'Aguardando o organizador iniciar o jogo...'}
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomLobbyPage;