
import { useLocation, useNavigate, useParams } from "react-router";
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";

import { useTheme } from "../../../../contexts/ThemeContext";
import { useAuth } from "../../../../contexts/hooks/useAuth";
import { usePlayer } from "../../../../contexts/hooks/usePlayer";
import { useLobby } from "../../hooks/useLobby";
import { preloadRoomLivePage } from "../../../../routes/Paths";
import { LobbyHeader } from "./components/LobbyHeader";
import { LobbyBanner } from "./components/LobbyBanner";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import { LobbyFeedback } from "./components/LobbyFeedback";
import { LobbyIdentity } from "./components/LobbyIdentity";
import { LobbyPlayers } from "./components/LobbyPlayers";
import { LobbyActions } from "./components/LobbyActions";


const RoomLobbyPage = () => {
    const { colors } = useTheme();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isMutedRef = useRef(false);

    const [isMuted, setIsMuted] = useState(false);
    const [, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(false);

    const { user } = useAuth();
    const { player } = usePlayer();

    const navigate = useNavigate();
    const location = useLocation();

    const { roomCode } = useParams<{
        roomCode: string;
    }>();

    const {
        room,
        loading,
        starting,
        ready,
        error,
        startRoom,
        toggleReady,
        toggleLeave,
    } = useLobby({ roomCode });

    const isHost = user?.user_id === room?.host_id;

    // Pré-carrega a página da partida.
    useEffect(() => {
        preloadRoomLivePage();
    }, []);

    // Mantém a referência do mute atualizada.
    useEffect(() => {
        isMutedRef.current = isMuted;

        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    // Gerenciamento da música conforme a rota.
    useEffect(() => {
        const audio = audioRef.current;

        if (!audio) return;

        const isLobbyPage =
            location.pathname === `/room/${roomCode}/lobby`;

        if (!isLobbyPage) {
            audio.pause();
            audio.currentTime = 0;
            setIsPlaying(false);
            return;
        }

        let isMounted = true;

        audio.volume = 0.8;
        audio.loop = true;
        audio.muted = isMutedRef.current;

        const handleFirstInteraction = () => {
            window.removeEventListener(
                "pointerdown",
                handleFirstInteraction
            );

            if (!isMounted || isMutedRef.current) return;

            audio.play()
                .then(() => {
                    if (isMounted) {
                        setIsPlaying(true);
                    }
                })
                .catch((err) => {
                    console.error("Erro ao reproduzir áudio:", err);
                });
        };

        if (!isMutedRef.current) {
            audio.play()
                .then(() => {
                    if (isMounted) {
                        setIsPlaying(true);
                    }
                })
                .catch(() => {
                    if (isMounted) {
                        window.addEventListener(
                            "pointerdown",
                            handleFirstInteraction,
                            { once: true }
                        );
                    }
                });
        }

        return () => {
            isMounted = false;

            window.removeEventListener(
                "pointerdown",
                handleFirstInteraction
            );

            audio.pause();
            audio.currentTime = 0;
        };
    }, [location.pathname, roomCode]);

    // Alterna o áudio.
    const toggleMute = () => {
        setIsMuted((current) => !current);
    };

    // Copia o código da sala.
    const handleCopyCode = async () => {
        if (!roomCode) return;

        try {
            await navigator.clipboard.writeText(roomCode);

            setCopied(true);

            window.setTimeout(() => {
                setCopied(false);
            }, 2500);
        } catch {
            console.error("Não foi possível copiar o código da sala.");
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

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

                    {/* Cabeçalho */}
                    <LobbyHeader
                        colors={colors}
                        isHost={isHost}
                        isMuted={isMuted}
                        onBack={handleBack}
                        onToggleMute={toggleMute}
                    />

                    {/* Banner */}
                    <LobbyBanner
                        colors={colors}
                        loading={loading}
                        roomName={room?.room_name}
                        isHost={isHost}
                    />

                    {/* Conteúdo principal */}
                    {!room || loading ? (
                        <LobbyFeedback
                            colors={colors}
                            loading={loading}
                            roomExists={!!room}
                            error={error}
                            onBack={handleBack}
                        />
                    ) : (
                        <div
                            className="
                        grid grid-cols-1
                        lg:grid-cols-[0.9fr_1.3fr]
                        gap-5 items-start
                    "
                        >
                            {/* Coluna esquerda */}
                            <div className="space-y-5">

                                {/* Identidade do jogador */}
                                <LobbyIdentity
                                    colors={colors}
                                    isHost={isHost}
                                    roomCode={roomCode}
                                    playerName={player?.player_name}
                                    copied={copied}
                                    onCopyCode={handleCopyCode}
                                />

                                {/* Papel na sala */}
                                <section
                                    className="
                                rounded-3xl border-2 border-b-8
                                p-5 sm:p-6 shadow-lg
                            "
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                        w-11 h-11 rounded-2xl
                                        flex items-center justify-center
                                        shrink-0 border-b-4
                                    "
                                            style={isHost
                                                ? {
                                                    backgroundColor: "#F5C542",
                                                    borderColor: "#C69B00",
                                                    color: "#7A5B00",
                                                }
                                                : {
                                                    backgroundColor: "#1CB0F6",
                                                    borderColor: "#0092D6",
                                                    color: "#FFFFFF",
                                                }
                                            }
                                        >
                                            {isHost
                                                ? <span className="text-xl">♛</span>
                                                : <span className="text-xl">✓</span>
                                            }
                                        </div>

                                        <div className="min-w-0">
                                            <h2
                                                className="font-black text-sm sm:text-base"
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
                                                style={{ color: colors.muted }}
                                            >
                                                {isHost
                                                    ? "Você controla o início da partida."
                                                    : "Aguarde o host iniciar a partida após se marcar como pronto."
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Ações */}
                                <LobbyActions
                                    colors={colors}
                                    isHost={isHost}
                                    starting={starting}
                                    ready={ready}
                                    room={room}
                                    onStart={() => void startRoom()}
                                    onToggleReady={() => void toggleReady()}
                                    onLeave={() => void toggleLeave()}
                                />
                            </div>

                            {/* Coluna direita */}
                            <div className="space-y-5">
                                <LobbyPlayers
                                    colors={colors}
                                    players={room.players}
                                    maxPlayers={room.max_players}
                                />

                                <FeedbackMessage
                                    feedBack={error}
                                    colors={colors}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default RoomLobbyPage;
