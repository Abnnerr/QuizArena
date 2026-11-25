
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import {
    FiArrowLeft,
    FiCheck,
    FiCopy,
    FiHeadphones,
    FiLogOut,
    FiUsers,
    FiZap,
} from "react-icons/fi";


import { usePlayer } from "../../../../contexts/hooks/usePlayer";

import { useLobby } from "../../hooks/useLobby";
import { preloadRoomLivePage } from "../../../../routes/Paths";

import { LobbyPlayers } from "./components/LobbyPlayers";

import Button from "../../../../shared/ui/Button";
import { TbHeadphonesOff } from "react-icons/tb";
import { useTheme } from "../../../../contexts/hooks/useTheme";
import { useToast } from "../../../../contexts/hooks/useToast";

const RoomLobbyPage = () => {
    const { colors } = useTheme();
    const { toast } = useToast();
    const { player } = usePlayer();

    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastErrorRef = useRef<string | null>(null);

    const [isMuted, setIsMuted] = useState(false);
    const [copied, setCopied] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const {
        room,
        loading,
        ready,
        error,
        toggleReady,
        toggleLeave,
    } = useLobby({ roomCode });

    const players = room?.players ?? [];
    const totalPlayers = players.length;
    const maxPlayers = room?.max_players ?? 0;

    const readyPlayers = players.filter(
        (item: { ready: boolean }) => item.ready
    ).length;

    const readyPercentage = totalPlayers
        ? Math.round((readyPlayers / totalPlayers) * 100)
        : 0;

    useEffect(() => {
        preloadRoomLivePage();
    }, []);

    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        audio.volume = 0.35;
        audio.loop = true;
        audio.muted = isMuted;

        if (isMuted) {
            audio.pause();
            return;
        }

        audio.play().catch(() => {
          
        });

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [isMuted]);

    useEffect(() => {
        if (!error) {
            lastErrorRef.current = null;
            return;
        }

        const message =
            typeof error === "string"
                ? error
                : "Ocorreu um erro ao atualizar a sala.";

        if (lastErrorRef.current === message) return;

        lastErrorRef.current = message;
        toast.error(message);
    }, [error, toast]);

    const handleCopyCode = async () => {
        if (!roomCode) {
            toast.error("Código da sala não encontrado.");
            return;
        }

        try {
            await navigator.clipboard.writeText(roomCode);

            setCopied(true);
            toast.success("Código copiado!");

            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Não foi possível copiar o código.");
        }
    };

    const handleReady = async () => {
        if (actionLoading) return;

        setActionLoading(true);

        try {
            await toggleReady();

            toast.success(
                ready
                    ? "Você deixou de estar pronto."
                    : "Você está pronto para jogar!"
            );
        } catch {
            toast.error("Não foi possível atualizar seu status.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleLeave = async () => {
        if (actionLoading) return;

        setActionLoading(true);

        try {
            await toggleLeave();
        } catch {
            toast.error("Não foi possível sair da sala.");
            setActionLoading(false);
        }
    };

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    if (loading) {
        return (
            <main
                className="flex min-h-screen items-center justify-center"
                style={{ backgroundColor: colors.background }}
            >
                <div className="text-center">
                    <div
                        className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"
                        style={{ borderColor: colors.primary }}
                    />
                    <p
                        className="mt-4 text-sm font-bold"
                        style={{ color: colors.muted }}
                    >
                        Entrando na sala...
                    </p>
                </div>
            </main>
        );
    }

    if (!room) {
        return (
            <main
                className="flex min-h-screen items-center justify-center p-5"
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                }}
            >
                <div
                    className="w-full max-w-md rounded-2xl border-2 border-b-[5px] p-6 text-center"
                    style={cardStyle}
                >
                    <h1 className="text-xl font-black">
                        Sala não encontrada
                    </h1>

                    <p
                        className="mt-2 text-sm font-semibold"
                        style={{ color: colors.muted }}
                    >
                        Verifique o código da sala ou tente novamente.
                    </p>

                    <Button
                        variant="primary"
                        fullWidth
                        className="mt-5"
                        leftIcon={<FiArrowLeft />}
                        onClick={() => navigate(-1)}
                    >
                        Voltar
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <>
            <Helmet>
                <title>QuizArena • Sala de Espera</title>
            </Helmet>

            <audio
                ref={audioRef}
                src="/lobby.mp3"
                preload="auto"
                loop
            />

            <main
                className="min-h-screen w-full px-4 py-5 sm:px-6 sm:py-8"
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    fontFamily: "'Nunito', sans-serif",
                }}
            >
                <div className="mx-auto w-full max-w-5xl space-y-6">

                    <header className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            <div
                                className="flex h-11 w-11 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: `${colors.primary}18`,
                                    color: colors.primary,
                                }}
                            >
                                <FiZap size={23} />
                            </div>

                            <div>
                                <p
                                    className="text-xs font-black uppercase tracking-wider"
                                    style={{ color: colors.muted }}
                                >
                                    QuizArena
                                </p>

                                <h1 className="text-lg font-black">
                                    Sala de espera
                                </h1>
                            </div>
                        </div>

                        <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={
                                isMuted
                                    ? <TbHeadphonesOff />
                                    : <FiHeadphones />
                            }
                            onClick={() => setIsMuted((value) => !value)}
                        >
                            <span className="hidden sm:inline">
                                {isMuted ? "Ativar som" : "Desativar som"}
                            </span>
                        </Button>
                    </header>

                    <section
                        className="relative overflow-hidden rounded-2xl border-2 border-b-[6px] p-6 sm:p-8"
                        style={{
                            backgroundColor: colors.primary,
                            borderColor: colors.border,
                            color: "#FFFFFF",
                        }}
                    >
                        <div className="relative z-10 max-w-2xl">
                            <span className="inline-flex rounded-lg bg-white/20 px-3 py-1 text-[10px] font-black uppercase tracking-wider">
                                Você está dentro!
                            </span>

                            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                                {room.room_name}
                            </h2>

                            <p className="mt-2 text-sm font-bold leading-relaxed text-white/85">
                                Prepare-se! Estamos aguardando os participantes
                                ficarem prontos para começar a diversão.
                            </p>
                        </div>

                        <div className="pointer-events-none absolute -right-8 -top-10 h-48 w-48 rounded-full border-[25px] border-white/10" />
                        <div className="pointer-events-none absolute -bottom-20 right-32 h-44 w-44 rounded-full bg-white/10" />
                    </section>

                    <section
                        className="rounded-2xl border-2 border-b-[5px] p-5 sm:p-6"
                        style={cardStyle}
                    >
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <p
                                    className="text-xs font-black uppercase tracking-wider"
                                    style={{ color: colors.muted }}
                                >
                                    Código para compartilhar
                                </p>

                                <p className="mt-2 text-3xl font-black tracking-[0.2em] sm:text-4xl">
                                    {roomCode}
                                </p>

                                <p
                                    className="mt-2 text-xs font-semibold"
                                    style={{ color: colors.muted }}
                                >
                                    Convide seus amigos para participar!
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                leftIcon={
                                    copied
                                        ? <FiCheck />
                                        : <FiCopy />
                                }
                                onClick={handleCopyCode}
                            >
                                {copied ? "Copiado!" : "Copiar código"}
                            </Button>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[0.85fr_1.4fr]">

                        <div className="space-y-5">

                            <section
                                className="rounded-2xl border-2 border-b-[5px] p-5"
                                style={cardStyle}
                            >
                                <p
                                    className="text-xs font-black uppercase tracking-wider"
                                    style={{ color: colors.muted }}
                                >
                                    Seu perfil
                                </p>

                                <div className="mt-4 flex items-center gap-3">
                                    <div
                                        className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-black"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary,
                                        }}
                                    >
                                        {player?.player_name?.charAt(0)?.toUpperCase() ?? "?"}
                                    </div>

                                    <div className="min-w-0">
                                        <h3 className="truncate font-black">
                                            {player?.player_name ?? "Jogador"}
                                        </h3>

                                        <p
                                            className="mt-1 text-xs font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            Participante da sala
                                        </p>
                                    </div>
                                </div>

                                <div
                                    className="mt-4 flex items-center gap-2 rounded-xl p-3"
                                    style={{
                                        backgroundColor: colors.surface,
                                    }}
                                >
                                    <span
                                        className="h-2.5 w-2.5 rounded-full"
                                        style={{
                                            backgroundColor: ready
                                                ? colors.success
                                                : colors.muted,
                                        }}
                                    />

                                    <span className="text-xs font-black">
                                        {ready
                                            ? "Você está pronto!"
                                            : "Você ainda não está pronto"}
                                    </span>
                                </div>
                            </section>

                            <section
                                className="rounded-2xl border-2 border-b-[5px] p-5"
                                style={cardStyle}
                            >
                                <div className="text-center">
                                    <div
                                        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl"
                                        style={{
                                            backgroundColor: ready
                                                ? `${colors.success}20`
                                                : `${colors.primary}18`,
                                            color: ready
                                                ? colors.success
                                                : colors.primary,
                                        }}
                                    >
                                        <FiCheck size={28} />
                                    </div>

                                    <h3 className="mt-3 text-lg font-black">
                                        {ready
                                            ? "Tudo pronto!"
                                            : "Está preparado?"}
                                    </h3>

                                    <p
                                        className="mt-1 text-xs font-semibold"
                                        style={{ color: colors.muted }}
                                    >
                                        {ready
                                            ? "Você já avisou que está pronto."
                                            : "Avise ao organizador que você está pronto para jogar."}
                                    </p>
                                </div>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    className="mt-5"
                                    isLoading={actionLoading}
                                    disabled={actionLoading}
                                    leftIcon={<FiCheck />}
                                    onClick={handleReady}
                                >
                                    {ready
                                        ? "Cancelar prontidão"
                                        : "Estou pronto!"}
                                </Button>
                            </section>
                            <Button
                                variant="danger"
                                fullWidth
                                leftIcon={<FiLogOut />}
                                disabled={actionLoading}
                                onClick={handleLeave}
                            >
                                Sair da sala
                            </Button>
                        </div>
                        <div className="space-y-5">

                            <section
                                className="rounded-2xl border-2 border-b-[5px] p-5"
                                style={cardStyle}
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <h3 className="font-black">
                                            Jogadores na sala
                                        </h3>

                                        <p
                                            className="mt-1 text-xs font-semibold"
                                            style={{ color: colors.muted }}
                                        >
                                            Veja quem está participando.
                                        </p>
                                    </div>

                                    <div
                                        className="flex items-center gap-2 rounded-lg px-3 py-2"
                                        style={{
                                            backgroundColor: `${colors.primary}18`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <FiUsers size={16} />
                                        <span className="text-sm font-black">
                                            {totalPlayers}/{maxPlayers}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <div className="mb-2 flex items-center justify-between">
                                        <span
                                            className="text-xs font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            Jogadores prontos
                                        </span>

                                        <span className="text-xs font-black">
                                            {readyPlayers}/{totalPlayers}
                                        </span>
                                    </div>

                                    <div
                                        className="h-2 overflow-hidden rounded-full"
                                        style={{
                                            backgroundColor: colors.border,
                                        }}
                                    >
                                        <div
                                            className="h-full rounded-full transition-all duration-300"
                                            style={{
                                                width: `${readyPercentage}%`,
                                                backgroundColor: colors.success,
                                            }}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section
                                className="rounded-2xl border-2 border-b-[5px] p-4 sm:p-5"
                                style={cardStyle}
                            >
                                <LobbyPlayers
                                    colors={colors}
                                    players={room.players}
                                    maxPlayers={room.max_players}
                                />
                            </section>
                        </div>
                    </div>

                    <footer
                        className="pb-3 text-center text-xs font-bold"
                        style={{ color: colors.muted }}
                    >
                        Aguarde o organizador iniciar a partida. Boa sorte!
                    </footer>
                </div>
            </main>
        </>
    );
};

export default RoomLobbyPage;
