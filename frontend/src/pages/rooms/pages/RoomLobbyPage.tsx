import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { BiUser, BiCrown, BiCopy, BiCheck } from "react-icons/bi";
import { BsPlayFill, BsArrowLeft, BsShieldCheck } from "react-icons/bs";

import { useLobby } from "../hooks/useLobby";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { usePlayer } from "../../../contexts/hooks/usePlayer";

const RoomLobbyPage = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const { user } = useAuth();
    const { player } = usePlayer()
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();

    const [copied, setCopied] = useState(false);

    const {
        room,
        loading,
        starting,
        ready,
        error,
        toggleReady,
        startRoom,
        toggleLeave
    } = useLobby({ roomCode });

    const isHost = user?.user_id === room?.host_id;

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.15;

        audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {
                const handleInteraction = () => {
                    audio.play().then(() => {
                        setIsPlaying(true);
                        setIsMuted(false);
                    });
                    window.removeEventListener("click", handleInteraction);
                };
                window.addEventListener("click", handleInteraction);
            });
    }, []);

    const toggleMute = () => {
        if (!audioRef.current) return;
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };
    const handleCopyCode = async () => {
        if (!roomCode) return;

        try {
            await navigator.clipboard.writeText(roomCode);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2500);
        } catch {
            console.error("Não foi possível copiar o código da sala.");
        }
    };

    return (
        <>
            <Helmet>
                <title>
                    QuizArena • {isHost ? "Painel do Organizador" : "Sala de Espera"}
                </title>
            </Helmet>
            <main className="min-h-screen bg-[#13092E] text-white flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none font-['Nunito',sans-serif]">
                <audio
                    ref={audioRef}
                    src="/intro-lobby.mp3"
                    loop
                    autoPlay
                    preload="auto"
                />
                <div className="absolute top-12 -left-12 w-48 h-48 bg-[#E21B3C]/20 rounded-3xl rotate-12 blur-2xl pointer-events-none" />
                <div className="absolute bottom-10 -right-12 w-60 h-60 bg-[#1368CE]/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/3 right-10 w-36 h-36 bg-[#D89E00]/15 rotate-45 rounded-2xl blur-2xl pointer-events-none" />
                <div className="absolute bottom-12 left-10 w-44 h-44 bg-[#26890C]/15 -rotate-12 rounded-full blur-2xl pointer-events-none" />

                <div className="w-full max-w-2xl relative z-10">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 bg-[#1E1145]/80 hover:bg-[#1E1145] border-2 border-white/10 text-zinc-300 hover:text-white font-extrabold px-4 py-2 rounded-2xl text-xs tracking-wider uppercase shadow-md transition-all cursor-pointer"
                        >
                            <BsArrowLeft className="w-4 h-4" />
                            <span>Voltar</span>
                        </button>

                        <div
                            className={`inline-flex items-center gap-2 text-white font-extrabold px-4 py-1.5 rounded-full text-xs tracking-wider uppercase ${isHost
                                ? "bg-[#D89E00] shadow-[0_4px_0_0_#997000]"
                                : "bg-[#1368CE] shadow-[0_4px_0_0_#0E4B94]"
                                }`}
                        >
                            {isHost && <BiCrown className="w-4 h-4" />}
                            {isHost ? "Painel do Organizador" : "Sala de Espera"}
                        </div>
                    </div>

                    {/* Logo & Title */}
                    <div className="text-center mb-6">
                        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center justify-center gap-2 drop-shadow-md mb-2">
                            <span className="bg-[#E21B3C] px-3 py-0.5 rounded-2xl -rotate-2 shadow-[0_5px_0_0_#A0132B]">
                                Quiz
                            </span>
                            <span className="bg-[#1368CE] px-3 py-0.5 rounded-2xl rotate-2 shadow-[0_5px_0_0_#0E4B94]">
                                Arena
                            </span>
                        </h1>

                        <p className="text-zinc-300 font-bold text-sm">
                            {loading ? "Carregando sala..." : room?.room_name}
                        </p>

                        {!loading && room && (
                            <p className="text-zinc-400 text-xs mt-2">
                                {isHost
                                    ? "Gerencie sua sala e prepare-se para iniciar."
                                    : "Você entrou na sala. Aguarde o organizador."}
                            </p>
                        )}
                    </div>

                    {/* Main card */}
                    <section className="bg-[#1E1145]/80 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] space-y-6">
                        {error && (
                            <div
                                role="alert"
                                className="bg-[#E21B3C]/20 border-2 border-[#E21B3C]/40 text-red-200 p-3 rounded-2xl text-xs font-bold text-center"
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="inline-block w-8 h-8 border-4 border-[#1368CE] border-t-transparent rounded-full animate-spin" />
                                <p className="text-zinc-400 font-bold text-xs uppercase tracking-wider">
                                    Conectando à sala...
                                </p>
                            </div>
                        ) : !room ? (
                            <div className="text-center py-8 space-y-4">
                                <p className="text-zinc-300">
                                    Não foi possível carregar os dados da sala.
                                </p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="bg-[#1368CE] px-5 py-3 rounded-xl font-bold cursor-pointer"
                                >
                                    Voltar
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Room information */}
                                {isHost ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between bg-black/40 border-2 border-white/10 rounded-2xl p-4 gap-4">
                                        <div className="text-center sm:text-left">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Código da Sala
                                            </span>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                                                <span className="text-xl sm:text-2xl font-black tracking-wider text-[#D89E00]">
                                                    {roomCode}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCopyCode}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#D89E00] hover:bg-[#e6a800] text-white font-black px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-[0_4px_0_0_#997000] active:shadow-none active:translate-y-1 transition-all cursor-pointer"
                                        >
                                            {copied ? <BiCheck className="w-4 h-4" /> : <BiCopy className="w-4 h-4" />}
                                            <span>{copied ? "Copiado!" : "Copiar Código"}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-black/40 border-2 border-white/10 rounded-2xl p-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#D89E00] text-white font-black text-lg uppercase shrink-0">
                                            {player?.player_name?.trim().charAt(0) || "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                                                Você entrou como
                                            </span>
                                            <span className="block text-white font-bold truncate">
                                                {player?.player_name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Role banner */}
                                <div className={`rounded-2xl border p-4 ${isHost ? "border-[#D89E00]/30 bg-[#D89E00]/10" : "border-[#1368CE]/30 bg-[#1368CE]/10"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${isHost ? "bg-[#D89E00]/20" : "bg-[#1368CE]/20"}`}>
                                            {isHost ? (
                                                <BiCrown className="w-6 h-6 text-[#D89E00]" />
                                            ) : (
                                                <BsShieldCheck className="w-5 h-5 text-cyan-300" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-black text-white">
                                                {isHost ? "Você é o organizador" : "Você é um participante"}
                                            </h2>
                                            <p className="text-xs text-zinc-300 mt-1">
                                                {isHost
                                                    ? "Compartilhe o código e aguarde os jogadores entrarem."
                                                    : "Marque-se como pronto quando estiver preparado."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Players List */}
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-2">
                                            <BiUser className="w-4 h-4 text-cyan-400" />
                                            Jogadores ({room.players.length}/{room.max_players})
                                        </h2>

                                        <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                                            Prontos: {room.players.filter((p) => p.ready).length}/{room.players.length}
                                        </span>
                                    </div>

                                    {room.players.length === 0 ? (
                                        <div className="text-center py-8 rounded-2xl bg-black/20 border border-white/10">
                                            <BiUser className="w-8 h-8 mx-auto mb-2 text-zinc-500" />
                                            <p className="text-sm font-bold text-zinc-300">
                                                Nenhum jogador na sala ainda.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                            {room.players.map((p) => (
                                                <div
                                                    key={p.player_id}
                                                    className="bg-black/30 border-2 border-white/10 rounded-2xl p-3 flex items-center justify-between"
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center text-xl font-black text-cyan-300">
                                                            {p.player_name.trim().charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <span className="font-extrabold text-sm text-white break-all">
                                                                {p.player_name}
                                                            </span>
                                                            <span className={`block text-[11px] font-bold ${p.ready ? "text-emerald-400" : "text-amber-400"}`}>
                                                                {p.ready ? "● Pronto" : "○ Aguardando"}
                                                            </span>
                                                        </div>
                                                    </div>


                                                    {p.ready && (
                                                        <div className="w-6 h-6 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                                            <BiCheck className="w-4 h-4" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-2">
                                    {isHost ? (
                                        <button
                                            onClick={startRoom}
                                            disabled={room.players.length < 2 || !room.players.every((p) => p.ready)}
                                            title={room.players.length < 2 ? "São necessários pelo menos 2 jogadores." : undefined}
                                            className="w-full bg-[#26890C] hover:bg-[#2cb20d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer transition-all"
                                        >
                                            <span>{starting ? "Iniciando..." : "Iniciar Partida"}</span>
                                            <BsPlayFill className="w-6 h-6" />
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={toggleLeave}
                                                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-black py-4 rounded-2xl active:translate-y-1 transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer"
                                            >
                                                <span>Sair da sala</span>
                                            </button>

                                            <button
                                                onClick={toggleReady}
                                                className={`w-full ${ready
                                                        ? "bg-[#E21B3C] hover:bg-[#c81735]"
                                                        : "bg-[#1368CE] hover:bg-[#1875e9]"
                                                    } text-white font-black py-4 rounded-2xl active:translate-y-1 transition-all flex items-center justify-center gap-2 text-base uppercase tracking-wider cursor-pointer`}
                                            >
                                                <span>{ready ? "Não estou pronto" : "Estou pronto"}</span>
                                                <BsShieldCheck className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </section >
                </div >
            </main >
        </>
    );
};

export default RoomLobbyPage;