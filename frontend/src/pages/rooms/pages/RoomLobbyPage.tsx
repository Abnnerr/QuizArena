
import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import { BiUser, BiCrown, BiCopy, BiCheck } from "react-icons/bi";
import {
    BsPlayFill,
    BsArrowLeft,
    BsShieldCheck,
    BsVolumeMuteFill,
    BsVolumeUpFill
} from "react-icons/bs";

import { useLobby } from "../hooks/useLobby";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useTheme } from "../../../contexts/ThemeContext";
import { preloadRoomLivePage } from "../../../routes/Paths";

const SKIP_COLOR = "#1CB0F6";
const HOST_COLOR = "#E9B94F";


const RoomLobbyPage = () => {
    const { colors } = useTheme();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [, setIsPlaying] = useState(false);

    const { user } = useAuth();
    const { player } = usePlayer();

    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();

    const [copied, setCopied] = useState(false);

    const {
        room,
        loading,
        starting,
        ready,
        error,
        startRoom,
        toggleReady,
        toggleLeave
    } = useLobby({ roomCode });

    const isHost = user?.user_id === room?.host_id;

    useEffect(() => {
        preloadRoomLivePage();
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        let isMounted = true;

        audio.volume = 0.80;
        audio.loop = true;
        audio.muted = isMuted;

        const handleFirstInteraction = () => {
            if (!isMounted || isMuted) return;

            audio.play()
                .then(() => {
                    if (isMounted) {
                        setIsPlaying(true);
                    }
                })
                .catch((err) => {
                    console.log("Erro ao reproduzir áudio:", err);
                });

            window.removeEventListener("click", handleFirstInteraction);
        };

        audio.play()
            .then(() => {
                if (isMounted) {
                    setIsPlaying(true);
                }
            })
            .catch(() => {
                window.addEventListener("click", handleFirstInteraction);
            });

        // Executado ao sair do lobby
        return () => {
            isMounted = false;

            window.removeEventListener("click", handleFirstInteraction);

            audio.pause();
            audio.currentTime = 0;

            setIsPlaying(false);
        };
    }, []);

    // Alternar mute
    const toggleMute = () => {
        const audio = audioRef.current;

        if (!audio) return;

        const nextMuted = !isMuted;

        audio.muted = nextMuted;
        setIsMuted(nextMuted);
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

    const cardStyle: React.CSSProperties = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const surfaceStyle: React.CSSProperties = {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    };

    const mutedStyle: React.CSSProperties = {
        color: colors.muted,
    };

    const hostStyle: React.CSSProperties = {
        backgroundColor: `${HOST_COLOR}`,
        borderColor: "#C69B00",
        color: "#7A5B00",
    };

    const playerStyle: React.CSSProperties = {
        backgroundColor: SKIP_COLOR,
        borderColor: "#0092D6",
        color: "#FFFFFF",
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Sala de Espera</title>
            </Helmet>

            <audio ref={audioRef} src="/lobby.mp3" preload="auto" />

            <main
                className="
                    w-full min-h-[100dvh] flex flex-col
                    items-center justify-center p-4 sm:p-6
                    font-['Nunito',sans-serif] select-none
                "
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                }}
            >
                <div className="w-full max-w-5xl relative z-10 space-y-5">

                    {/* HEADER */}
                    <header className="flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="
                                inline-flex items-center gap-2
                                border-2 border-b-4 font-black
                                px-4 py-2.5 rounded-2xl text-xs
                                sm:text-sm tracking-wider uppercase
                                transition-all active:border-b-2
                                active:translate-y-0.5 shadow-sm
                            "
                            style={{
                                ...cardStyle,
                                color: colors.muted,
                            }}
                        >
                            <BsArrowLeft
                                className="w-5 h-5"
                                style={{ color: colors.muted }}
                            />
                            Voltar
                        </button>

                        <div className="flex items-center gap-2">
                            <div
                                className={`
                                    hidden sm:inline-flex items-center
                                    gap-2 font-black px-4 py-2.5
                                    rounded-2xl text-xs tracking-wider
                                    uppercase border-b-4
                                `}
                                style={isHost ? hostStyle : playerStyle}
                            >
                                {isHost
                                    ? <BiCrown className="w-5 h-5" />
                                    : <BsShieldCheck className="w-5 h-5" />
                                }

                                {isHost ? "Organizador" : "Participante"}
                            </div>

                            <button
                                type="button"
                                onClick={toggleMute}
                                title={isMuted ? "Ativar som" : "Mutar som"}
                                aria-label={isMuted ? "Ativar som" : "Mutar som"}
                                className="
                                    border-2 border-b-4 p-2.5 sm:p-3
                                    rounded-2xl transition-all
                                    active:border-b-2 active:translate-y-0.5
                                    shadow-sm flex items-center justify-center
                                "
                                style={cardStyle}
                            >
                                {isMuted
                                    ? <BsVolumeMuteFill
                                        className="w-5 h-5"
                                        style={{ color: colors.danger }}
                                    />
                                    : <BsVolumeUpFill
                                        className="w-5 h-5"
                                        style={{ color: colors.primary }}
                                    />
                                }
                            </button>
                        </div>
                    </header>

                    {/* BANNER */}
                    <section className="
                        flex flex-col sm:flex-row items-center gap-4
                    ">
                        <div
                            className="
                                w-20 h-20 sm:w-24 sm:h-24 shrink-0
                                rounded-3xl border-2 border-b-8
                                p-2.5 shadow-lg flex items-center
                                justify-center
                            "
                            style={cardStyle}
                        >
                            <img
                                src="/favicon-quiz.png"
                                alt="QuizArena"
                                className="h-full w-full object-contain drop-shadow"
                            />
                        </div>

                        <div
                            className="
                                relative border-2 border-b-4
                                rounded-2xl p-4 sm:p-5 text-center
                                sm:text-left shadow-lg w-full min-w-0
                            "
                            style={cardStyle}
                        >
                            <div
                                className="
                                    hidden sm:block absolute -left-3
                                    top-1/2 -translate-y-1/2
                                    w-0 h-0 border-y-8
                                    border-y-transparent border-r-8
                                "
                                style={{ borderRightColor: colors.border }}
                            />

                            <div
                                className="
                                    hidden sm:block absolute -left-2
                                    top-1/2 -translate-y-1/2
                                    w-0 h-0 border-y-6
                                    border-y-transparent border-r-6
                                "
                                style={{ borderRightColor: colors.card }}
                            />

                            <div className="
                                flex flex-wrap items-center justify-center
                                sm:justify-start gap-2 mb-1.5
                            ">
                                <span
                                    className="
                                        text-[9px] font-black uppercase
                                        tracking-widest
                                    "
                                    style={mutedStyle}
                                >
                                    Aguardando jogadores
                                </span>
                            </div>

                            <h1
                                className="
                                    text-xl sm:text-2xl font-black
                                    tracking-tight break-words
                                "
                                style={{ color: colors.text }}
                            >
                                {loading
                                    ? "Carregando arena..."
                                    : room?.room_name || "Sala de espera"
                                }
                            </h1>

                            <p
                                className="
                                    font-extrabold text-xs sm:text-sm
                                    mt-1 leading-relaxed
                                "
                                style={{ color: colors.muted }}
                            >
                                {isHost
                                    ? "Gerencie os participantes e inicie a partida quando todos estiverem prontos!"
                                    : "Você está dentro! Prepare-se e marque 'Estou pronto'."
                                }
                            </p>
                        </div>
                    </section>

                    {/* ERRO */}
                    {error && (
                        <div
                            role="alert"
                            className="
                                border-2 border-b-4 p-4 rounded-2xl
                                text-xs sm:text-sm font-black text-center
                            "
                            style={{
                                backgroundColor: `${colors.danger}20`,
                                borderColor: colors.danger,
                                color: colors.danger,
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <section
                            className="
                                border-2 border-b-8 rounded-3xl
                                p-8 sm:p-12 shadow-lg text-center space-y-3
                            "
                            style={cardStyle}
                        >
                            <div
                                className="
                                    inline-block w-10 h-10 border-4
                                    border-t-transparent rounded-full animate-spin
                                "
                                style={{
                                    borderColor: SKIP_COLOR,
                                    borderTopColor: "transparent",
                                }}
                            />

                            <p
                                className="
                                    font-black text-xs uppercase
                                    tracking-wider
                                "
                                style={mutedStyle}
                            >
                                Conectando à sala...
                            </p>
                        </section>
                    ) : !room ? (
                        <section
                            className="
                                border-2 border-b-8 rounded-3xl
                                p-8 text-center space-y-4
                            "
                            style={cardStyle}
                        >
                            <div
                                className="text-4xl font-black"
                                style={{ color: colors.danger }}
                            >
                                !
                            </div>

                            <h2
                                className="text-lg font-black"
                                style={{ color: colors.text }}
                            >
                                Sala não encontrada
                            </h2>

                            <p
                                className="font-bold text-sm"
                                style={{ color: colors.muted }}
                            >
                                Não foi possível carregar os dados desta sala.
                                Verifique sua conexão ou tente novamente.
                            </p>

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="
                                    border-b-4 px-6 py-3 rounded-2xl
                                    font-black text-sm uppercase
                                    tracking-wider active:translate-y-1
                                    active:border-b-0 transition-all shadow-md
                                "
                                style={playerStyle}
                            >
                                Voltar ao início
                            </button>
                        </section>
                    ) : (
                        <div className="
                            grid grid-cols-1 lg:grid-cols-[0.9fr_1.3fr]
                            gap-5 items-start
                        ">

                            {/* COLUNA ESQUERDA */}
                            <div className="space-y-5">

                                {/* CÓDIGO / PERFIL */}
                                {isHost ? (
                                    <section
                                        className="
                                            border-2 border-b-8 rounded-3xl
                                            p-5 sm:p-6 shadow-lg
                                        "
                                        style={cardStyle}
                                    >
                                        <div className="flex items-center gap-3 mb-5">
                                            <div
                                                className="
                                                    w-10 h-10 rounded-xl
                                                    border-b-4 flex items-center
                                                    justify-center
                                                "
                                                style={hostStyle}
                                            >
                                                <BiCrown className="w-6 h-6" />
                                            </div>

                                            <div>
                                                <h2
                                                    className="
                                                        text-sm font-black
                                                        uppercase tracking-wider
                                                    "
                                                    style={{ color: colors.text }}
                                                >
                                                    Código da sala
                                                </h2>

                                                <p
                                                    className="text-[11px] font-bold"
                                                    style={mutedStyle}
                                                >
                                                    Compartilhe com seus amigos
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                border-2 border-b-4 rounded-2xl
                                                p-5 text-center mb-4
                                            "
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <span
                                                className="
                                                    text-3xl sm:text-4xl
                                                    font-black tracking-[0.2em]
                                                    break-all
                                                "
                                                style={{ color: colors.primary }}
                                            >
                                                {roomCode}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCopyCode}
                                            className="
                                                w-full inline-flex items-center
                                                justify-center gap-2
                                                border-b-4 font-black px-5 py-3.5
                                                rounded-2xl text-xs uppercase
                                                tracking-wider active:translate-y-1
                                                active:border-b-0 transition-all shadow-sm
                                            "
                                            style={{
                                                ...hostStyle,
                                                backgroundColor: colors.primary,
                                                borderColor: colors.primary,
                                                color: colors.background,
                                            }}
                                        >
                                            {copied
                                                ? <BiCheck className="w-5 h-5" />
                                                : <BiCopy className="w-5 h-5" />
                                            }

                                            {copied
                                                ? "Código copiado!"
                                                : "Copiar código"
                                            }
                                        </button>
                                    </section>
                                ) : (
                                    <section
                                        className="
                                            border-2 border-b-8 rounded-3xl
                                            p-5 sm:p-6 shadow-lg
                                        "
                                        style={cardStyle}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="
                                                    w-14 h-14 shrink-0
                                                    rounded-2xl border-b-4
                                                    flex items-center justify-center
                                                    text-xl font-black uppercase
                                                "
                                                style={playerStyle}
                                            >
                                                {player?.player_name?.trim().charAt(0) || "?"}
                                            </div>

                                            <div className="min-w-0">
                                                <span
                                                    className="
                                                        block text-xs font-black
                                                        uppercase tracking-wider
                                                    "
                                                    style={{ color: SKIP_COLOR }}
                                                >
                                                    Você entrou como
                                                </span>

                                                <span
                                                    className="
                                                        block font-black
                                                        text-lg truncate
                                                    "
                                                    style={{ color: colors.text }}
                                                >
                                                    {player?.player_name}
                                                </span>

                                                <span
                                                    className="text-[11px] font-bold"
                                                    style={mutedStyle}
                                                >
                                                    Participante da partida
                                                </span>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* FUNÇÃO */}
                                <section
                                    className="
                                        rounded-3xl border-2 border-b-8
                                        p-5 sm:p-6 shadow-lg
                                    "
                                    style={cardStyle}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                                w-11 h-11 rounded-2xl
                                                flex items-center justify-center
                                                shrink-0 border-b-4
                                            "
                                            style={isHost ? hostStyle : playerStyle}
                                        >
                                            {isHost
                                                ? <BiCrown className="w-6 h-6" />
                                                : <BsShieldCheck className="w-6 h-6" />
                                            }
                                        </div>

                                        <div className="min-w-0">
                                            <h2
                                                className="
                                                    font-black text-sm sm:text-base
                                                "
                                                style={{ color: colors.text }}
                                            >
                                                {isHost
                                                    ? "Você é o Organizador"
                                                    : "Você é um Participante"
                                                }
                                            </h2>

                                            <p
                                                className="
                                                    text-xs font-extrabold mt-1
                                                    leading-relaxed
                                                "
                                                style={mutedStyle}
                                            >
                                                {isHost
                                                    ? "Você controla o início da partida."
                                                    : "Aguarde o host iniciar a partida após se marcar como pronto."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* AÇÕES */}
                                <section
                                    className="
                                        border-2 border-b-8 rounded-3xl
                                        p-5 sm:p-6 shadow-lg
                                    "
                                    style={cardStyle}
                                >
                                    {isHost ? (
                                        <div className="space-y-4">
                                            <div>
                                                <h3
                                                    className="text-sm font-black"
                                                    style={{ color: colors.text }}
                                                >
                                                    Tudo pronto?
                                                </h3>

                                                <p
                                                    className="
                                                        mt-1 text-xs font-bold
                                                        leading-relaxed
                                                    "
                                                    style={mutedStyle}
                                                >
                                                    Inicie quando todos os participantes estiverem prontos.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={startRoom}
                                                disabled={
                                                    starting ||
                                                    room.players.length < 2 ||
                                                    !room.players.every((p: any) => p.ready)
                                                }
                                                title={
                                                    room.players.length < 2
                                                        ? "São necessários pelo menos 2 jogadores."
                                                        : undefined
                                                }
                                                className="
                                                    w-full border-b-4
                                                    active:border-b-0 active:translate-y-1
                                                    font-black py-4 rounded-2xl
                                                    flex items-center justify-center
                                                    gap-3 text-base uppercase
                                                    tracking-wider transition-all
                                                    shadow-md disabled:cursor-not-allowed
                                                    disabled:translate-y-0
                                                    disabled:border-b-4
                                                "
                                                style={{
                                                    backgroundColor: colors.success,
                                                    borderColor: colors.success,
                                                    color: "#FFFFFF",
                                                }}
                                            >
                                                {starting
                                                    ? "Iniciando..."
                                                    : "Iniciar partida"
                                                }

                                                <BsPlayFill className="w-7 h-7" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <button
                                                type="button"
                                                onClick={toggleReady}
                                                className="
                                                    w-full border-b-4 font-black
                                                    py-4 rounded-2xl active:border-b-0
                                                    active:translate-y-1 transition-all
                                                    flex items-center justify-center
                                                    gap-2 text-sm uppercase
                                                    tracking-wider shadow-md text-white
                                                "
                                                style={{
                                                    backgroundColor: ready
                                                        ? colors.danger
                                                        : colors.success,
                                                    borderColor: ready
                                                        ? colors.danger
                                                        : colors.success,
                                                }}
                                            >
                                                <BsShieldCheck className="w-5 h-5" />

                                                {ready
                                                    ? "Cancelar prontidão"
                                                    : "Estou pronto"
                                                }
                                            </button>

                                            <button
                                                type="button"
                                                onClick={toggleLeave}
                                                className="
                                                    w-full border-2 border-b-4
                                                    font-black py-3 rounded-2xl
                                                    active:border-b-2
                                                    active:translate-y-0.5
                                                    transition-all flex items-center
                                                    justify-center gap-2 text-xs
                                                    uppercase tracking-wider
                                                "
                                                style={{
                                                    backgroundColor: colors.card,
                                                    borderColor: colors.border,
                                                    color: colors.muted,
                                                }}
                                            >
                                                Sair da sala
                                            </button>
                                        </div>
                                    )}
                                </section>
                            </div>

                            {/* COLUNA DIREITA - JOGADORES */}
                            <section
                                className="
                                    border-2 border-b-8 rounded-3xl
                                    p-5 sm:p-6 shadow-lg
                                "
                                style={cardStyle}
                            >
                                {/* CABEÇALHO */}
                                <div className="
                                    flex flex-wrap items-center
                                    justify-between gap-3 mb-5
                                ">
                                    <div>
                                        <h2
                                            className="
                                                text-sm font-black uppercase
                                                tracking-widest flex items-center gap-2
                                            "
                                            style={{ color: colors.text }}
                                        >
                                            <BiUser
                                                className="w-5 h-5"
                                                style={{ color: SKIP_COLOR }}
                                            />
                                            Jogadores
                                        </h2>

                                        <p
                                            className="text-[11px] font-bold mt-1"
                                            style={mutedStyle}
                                        >
                                            Participantes da sala
                                        </p>
                                    </div>

                                    <span
                                        className="
                                            text-xs font-black text-white
                                            px-3 py-2 rounded-xl border-b-4
                                        "
                                        style={playerStyle}
                                    >
                                        {room.players.length}/{room.max_players}
                                    </span>
                                </div>

                                {/* PROGRESSO */}
                                <div
                                    className="
                                        border-2 rounded-2xl p-4 mb-5
                                    "
                                    style={surfaceStyle}
                                >
                                    <div className="
                                        flex items-center justify-between
                                        gap-2 mb-3
                                    ">
                                        <span
                                            className="
                                                text-[11px] font-black
                                                uppercase tracking-wider
                                            "
                                            style={mutedStyle}
                                        >
                                            Prontidão dos jogadores
                                        </span>

                                        <span
                                            className="text-xs font-black"
                                            style={{ color: colors.success }}
                                        >
                                            {room.players.filter((p: any) => p.ready).length}/{room.players.length}
                                        </span>
                                    </div>

                                    <div
                                        className="h-3 rounded-full overflow-hidden"
                                        style={{ backgroundColor: colors.border }}
                                    >
                                        <div
                                            className="
                                                h-full rounded-full
                                                transition-all duration-500
                                            "
                                            style={{
                                                width: `${room.players.length > 0
                                                    ? (room.players.filter((p: any) => p.ready).length / room.players.length) * 100
                                                    : 0
                                                    }%`,
                                                backgroundColor: colors.success,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* LISTA */}
                                <div className="mb-5">
                                    {room.players.length === 0 ? (
                                        <div
                                            className="
                                                text-center py-10 rounded-2xl
                                                border-2 border-dashed
                                            "
                                            style={surfaceStyle}
                                        >
                                            <BiUser
                                                className="w-9 h-9 mx-auto mb-3"
                                                style={{ color: colors.muted }}
                                            />

                                            <p
                                                className="text-sm font-black"
                                                style={{ color: colors.muted }}
                                            >
                                                Nenhum jogador ainda
                                            </p>

                                            <p
                                                className="text-xs font-bold mt-1"
                                                style={mutedStyle}
                                            >
                                                Compartilhe o código para convidar amigos.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="
                                            grid grid-cols-1 sm:grid-cols-2
                                            gap-3 max-h-[420px]
                                            overflow-y-auto pr-1
                                        ">
                                            {room.players.map((p: any) => (
                                                <div
                                                    key={p.player_id}
                                                    className="
                                                        border-2 border-b-4
                                                        rounded-2xl p-3 flex
                                                        items-center justify-between
                                                        gap-2 transition-all
                                                    "
                                                    style={{
                                                        backgroundColor: p.ready
                                                            ? `${colors.success}18`
                                                            : colors.surface,
                                                        borderColor: p.ready
                                                            ? colors.success
                                                            : colors.border,
                                                    }}
                                                >
                                                    <div className="
                                                        flex items-center gap-3 min-w-0
                                                    ">
                                                        <div
                                                            className="
                                                                w-10 h-10 shrink-0
                                                                rounded-xl text-white
                                                                flex items-center
                                                                justify-center text-base
                                                                font-black border-b-2
                                                            "
                                                            style={playerStyle}
                                                        >
                                                            {p.player_name?.trim().charAt(0)?.toUpperCase() || "?"}
                                                        </div>

                                                        <div className="min-w-0">
                                                            <span
                                                                className="
                                                                    font-black text-sm
                                                                    block truncate
                                                                "
                                                                style={{ color: colors.text }}
                                                            >
                                                                {p.player_name}
                                                            </span>

                                                            <span
                                                                className="
                                                                    block text-[11px]
                                                                    font-black
                                                                "
                                                                style={{
                                                                    color: p.ready
                                                                        ? colors.success
                                                                        : colors.muted,
                                                                }}
                                                            >
                                                                {p.ready
                                                                    ? "● Pronto"
                                                                    : "○ Aguardando"
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {p.ready && (
                                                        <div
                                                            className="
                                                                w-7 h-7 shrink-0
                                                                rounded-full text-white
                                                                flex items-center
                                                                justify-center font-black
                                                                border-b-2
                                                            "
                                                            style={{
                                                                backgroundColor: colors.success,
                                                                borderColor: colors.success,
                                                            }}
                                                        >
                                                            <BiCheck className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* RODAPÉ */}
                                <div
                                    className="
                                        border-t-2 pt-4 flex items-center
                                        justify-between gap-2
                                    "
                                    style={{ borderColor: colors.border }}
                                >
                                    <span
                                        className="
                                            text-xs font-black uppercase
                                            tracking-wider
                                        "
                                        style={mutedStyle}
                                    >
                                        Status da sala
                                    </span>

                                    <span
                                        className="
                                            flex items-center gap-2
                                            text-[11px] font-black uppercase
                                        "
                                        style={{ color: colors.success }}
                                    >
                                        Aguardando início
                                    </span>
                                </div>
                            </section>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default RoomLobbyPage;
