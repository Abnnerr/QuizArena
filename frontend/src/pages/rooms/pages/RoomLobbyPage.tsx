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

            <main className="w-full flex-1 flex flex-col items-center justify-center p-4 sm:p-6 max-w-2xl mx-auto my-auto min-h-[calc(100vh-80px)] select-none font-['Nunito',sans-serif]">
                <audio
                    ref={audioRef}
                    src="/intro-lobby.mp3"
                    loop
                    autoPlay
                    preload="auto"
                />

                <div className="w-full relative z-10 space-y-5">

                    {/* Topo / Cabeçalho de Navegação */}
                    <div className="flex items-center justify-between gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 bg-white hover:bg-[#F7F7F7] border-2 border-[#E5E5E5] border-b-4 text-[#777777] hover:text-[#4B4B4B] font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer shadow-sm"
                        >
                            <BsArrowLeft className="w-5 h-5 text-[#AFAFAF]" />
                            <span>Voltar</span>
                        </button>

                        <div
                            className={`inline-flex items-center gap-2 text-white font-black px-4 py-2.5 rounded-2xl text-xs sm:text-sm tracking-wider uppercase shadow-sm ${isHost
                                    ? "bg-[#FFC800] border-b-4 border-[#E5B200] text-[#7A5B00]"
                                    : "bg-[#1CB0F6] border-b-4 border-[#0092D6] text-white"
                                }`}
                        >
                            {isHost && <BiCrown className="w-5 h-5" />}
                            <span>{isHost ? "Painel do Host" : "Sala de Espera"}</span>
                        </div>
                    </div>

                    {/* Balão de Fala e Mascote estilo Duolingo */}
                    <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-3xl border-2 border-[#E5E5E5] border-b-8 p-2.5 shadow-sm flex-shrink-0 flex items-center justify-center transform hover:scale-105 transition-transform">
                            <img src="/favicon-quiz.png" alt="QuizArena" className="h-full w-full object-contain" />
                        </div>

                        <div className="relative bg-white border-2 border-[#E5E5E5] border-b-4 rounded-2xl p-4 sm:p-5 text-center sm:text-left shadow-sm w-full sm:w-auto flex-1">
                            <div className="hidden sm:block absolute -left-3 top-1/2 -translate-y-1/2 w-0 h-0 border-y-8 border-y-transparent border-r-8 border-r-[#E5E5E5]" />
                            <div className="hidden sm:block absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-6 border-y-transparent border-r-6 border-r-white" />

                            <h1 className="text-xl sm:text-2xl font-black text-[#4B4B4B] tracking-tight">
                                {loading ? "Carregando arena..." : room?.room_name}
                            </h1>
                            <p className="text-[#777777] font-extrabold text-xs sm:text-sm mt-0.5">
                                {!loading && room
                                    ? isHost
                                        ? "Gerencie os participantes e inicie a partida quando todos estiverem prontos!"
                                        : "Você está dentro! Prepare-se e marque 'Estou pronto'."
                                    : "Aguarde um instante..."}
                            </p>
                        </div>
                    </div>

                    {/* Container Card Principal estilo Duolingo */}
                    <section className="bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">

                        {/* Alerta de Erro em Vermelho */}
                        {error && (
                            <div
                                role="alert"
                                className="bg-[#FFD2D2] border-2 border-[#FF4B4B] border-b-4 text-[#A80000] p-4 rounded-2xl text-xs sm:text-sm font-black text-center animate-bounce-short"
                            >
                                {error}
                            </div>
                        )}

                        {loading ? (
                            <div className="text-center py-12 space-y-3">
                                <div className="inline-block w-10 h-10 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                <p className="text-[#AFAFAF] font-black text-xs uppercase tracking-wider">
                                    Conectando à sala...
                                </p>
                            </div>
                        ) : !room ? (
                            <div className="text-center py-8 space-y-4">
                                <p className="text-[#777777] font-black text-base">
                                    Não foi possível carregar os dados da sala.
                                </p>
                                <button
                                    onClick={() => navigate(-1)}
                                    className="bg-[#1CB0F6] hover:bg-[#00A2ED] text-white border-b-4 border-[#0092D6] px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider active:translate-y-1 active:border-b-0 cursor-pointer transition-all"
                                >
                                    Voltar para o Início
                                </button>
                            </div>
                        ) : (
                            <>
                                {/* Banner de Código da Sala (Host) ou Perfil (Player) */}
                                {isHost ? (
                                    <div className="flex flex-col sm:flex-row items-center justify-between bg-[#FFFBF0] border-2 border-[#FFC800] border-b-4 rounded-2xl p-4 gap-4">
                                        <div className="text-center sm:text-left">
                                            <span className="block text-xs font-black uppercase tracking-widest text-[#A38000]">
                                                Código da Sala
                                            </span>
                                            <div className="flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                                                <span className="text-2xl sm:text-3xl font-black tracking-widest text-[#7A5B00]">
                                                    {roomCode}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleCopyCode}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FFC800] hover:bg-[#FFD22E] border-b-4 border-[#E5B200] text-[#7A5B00] font-black px-5 py-3 rounded-2xl text-xs uppercase tracking-wider active:translate-y-1 active:border-b-0 transition-all cursor-pointer shadow-sm"
                                        >
                                            {copied ? (
                                                <BiCheck className="w-5 h-5 text-[#7A5B00]" />
                                            ) : (
                                                <BiCopy className="w-5 h-5 text-[#7A5B00]" />
                                            )}
                                            <span>{copied ? "Copiado!" : "Copiar Código"}</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 bg-[#E8F7FE] border-2 border-[#1CB0F6] border-b-4 rounded-2xl p-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1CB0F6] text-white font-black text-xl uppercase shrink-0 border-b-4 border-[#0092D6]">
                                            {player?.player_name?.trim().charAt(0) || "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <span className="block text-xs font-black uppercase tracking-wider text-[#0092D6]">
                                                Você entrou como
                                            </span>
                                            <span className="block text-[#4B4B4B] font-black text-lg truncate">
                                                {player?.player_name}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Caixa Informativa de Função */}
                                <div
                                    className={`rounded-2xl border-2 border-b-4 p-4 ${isHost
                                            ? "border-[#FFC800] bg-[#FFFBF0]"
                                            : "border-[#1CB0F6] bg-[#E8F7FE]"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border-b-4 ${isHost
                                                    ? "bg-[#FFC800] border-[#E5B200] text-[#7A5B00]"
                                                    : "bg-[#1CB0F6] border-[#0092D6] text-white"
                                                }`}
                                        >
                                            {isHost ? (
                                                <BiCrown className="w-6 h-6" />
                                            ) : (
                                                <BsShieldCheck className="w-6 h-6" />
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-black text-base text-[#4B4B4B]">
                                                {isHost ? "Você é o Organizador" : "Você é um Participante"}
                                            </h2>
                                            <p className="text-xs font-extrabold text-[#777777] mt-0.5">
                                                {isHost
                                                    ? "Compartilhe o código acima para convidar jogadores."
                                                    : "Aguarde o host iniciar a partida após se marcar como pronto."}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Seção de Jogadores */}
                                <div>
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                        <h2 className="text-xs font-black uppercase tracking-widest text-[#AFAFAF] flex items-center gap-2">
                                            <BiUser className="w-5 h-5 text-[#1CB0F6]" />
                                            <span>Jogadores ({room.players.length}/{room.max_players})</span>
                                        </h2>

                                        <span className="text-xs font-black text-[#2B7200] bg-[#D7FFB8] px-3 py-1 rounded-xl border-2 border-[#58CC02] border-b-4">
                                            Prontos: {room.players.filter((p) => p.ready).length}/{room.players.length}
                                        </span>
                                    </div>

                                    {room.players.length === 0 ? (
                                        <div className="text-center py-8 rounded-2xl bg-[#F7F7F7] border-2 border-dashed border-[#E5E5E5]">
                                            <BiUser className="w-8 h-8 mx-auto mb-2 text-[#AFAFAF]" />
                                            <p className="text-sm font-black text-[#777777]">
                                                Nenhum jogador na sala ainda.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                            {room.players.map((p) => (
                                                <div
                                                    key={p.player_id}
                                                    className={`border-2 border-b-4 rounded-2xl p-3 flex items-center justify-between transition-all ${p.ready
                                                            ? "bg-[#D7FFB8]/50 border-[#58CC02]"
                                                            : "bg-[#F7F7F7] border-[#E5E5E5]"
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-[#1CB0F6] text-white flex items-center justify-center text-base font-black border-b-2 border-[#0092D6]">
                                                            {p.player_name.trim().charAt(0).toUpperCase()}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <span className="font-black text-sm text-[#4B4B4B] block truncate">
                                                                {p.player_name}
                                                            </span>
                                                            <span
                                                                className={`block text-[11px] font-black ${p.ready ? "text-[#2B7200]" : "text-[#7A5B00]"
                                                                    }`}
                                                            >
                                                                {p.ready ? "● Pronto" : "○ Aguardando"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {p.ready && (
                                                        <div className="w-7 h-7 shrink-0 rounded-full bg-[#58CC02] text-white flex items-center justify-center font-black border-b-2 border-[#46A302]">
                                                            <BiCheck className="w-5 h-5 stroke-[2]" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Rodapé e Botões de Ação */}
                                <div className="pt-2">
                                    {isHost ? (
                                        <button
                                            onClick={startRoom}
                                            disabled={
                                                room.players.length < 2 ||
                                                !room.players.every((p) => p.ready)
                                            }
                                            title={
                                                room.players.length < 2
                                                    ? "São necessários pelo menos 2 jogadores."
                                                    : undefined
                                            }
                                            className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 text-lg uppercase tracking-wider cursor-pointer transition-all shadow-sm disabled:bg-[#E5E5E5] disabled:border-[#CECECE] disabled:text-[#AFAFAF] disabled:cursor-not-allowed disabled:translate-y-0 disabled:border-b-4"
                                        >
                                            <span>
                                                {starting ? "Iniciando..." : "Iniciar Partida"}
                                            </span>
                                            <BsPlayFill className="w-7 h-7" />
                                        </button>
                                    ) : (
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button
                                                onClick={toggleLeave}
                                                className="w-full sm:w-1/3 bg-white hover:bg-[#FFD2D2]/30 border-2 border-[#FF4B4B] border-b-4 text-[#FF4B4B] font-black py-3.5 rounded-2xl active:border-b-2 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                                            >
                                                <span>Sair</span>
                                            </button>

                                            <button
                                                onClick={toggleReady}
                                                className={`w-full sm:w-2/3 border-b-4 font-black py-3.5 rounded-2xl active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer shadow-sm text-white ${ready
                                                        ? "bg-[#FF4B4B] hover:bg-[#FF5E5E] border-[#D43F3F]"
                                                        : "bg-[#58CC02] hover:bg-[#61E002] border-[#46A302]"
                                                    }`}
                                            >
                                                <span>
                                                    {ready ? "Não estou pronto" : "Estou pronto"}
                                                </span>
                                                <BsShieldCheck className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </section>
                </div>
            </main>
        </>
    );
};

export default RoomLobbyPage;