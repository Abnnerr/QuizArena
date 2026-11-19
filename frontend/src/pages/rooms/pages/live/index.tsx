
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import useRoomLive from "../../hooks/useRoomLive";
import { useTheme } from "../../../../contexts/ThemeContext";
import LiveHeader from "./components/LiveHeader";
import LivePowerUps from "./components/LivePowerUps";
import LiveAlternatives from "./components/LiveAlternatives";
import LivePlayerStatus from "./components/LivePlayerStatus";
import LiveSkipOverlay from "./components/LiveSkipOverlay";
import LivePowerUpModal from "./components/LivePowerUpModal";
import LiveQuestion from "./components/LiveQuestion";
import LiveProgressBar from "./components/LiveProgressBar";


const SKIP_COLOR = "#1CB0F6";

const RoomLivePage = () => {
    const {
        handleAnswer,
        isCriticalTime,
        handleKeyDown,
        progress,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
        answered,
        powerUp,
        selectedPowerUp,
        setSelectedPowerUp,
        onConfirmPowerUp,
        hiddenAlternativeIds,
        skip,
        isHost,
        players,
        correctAlternative,
        alternativeStatistics,
        playerNameUsed,
    } = useRoomLive();

    const { colors } = useTheme();

    const [isMusicMuted, setIsMusicMuted] = useState(() => {
        const savedMute = localStorage.getItem("mute_ambient:live");

        return savedMute !== null
            ? JSON.parse(savedMute)
            : true;
    });

    const prevHiddenCountRef = useRef(0);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    // Salva a posição atual da música.
    const saveMusicPosition = () => {
        const audio = bgMusicRef.current;

        if (!audio || !Number.isFinite(audio.currentTime)) return;

        localStorage.setItem(
            "live_music_position",
            JSON.stringify(audio.currentTime)
        );
    };

    // Controla a música e restaura a posição salva.
    useEffect(() => {
        const audio = bgMusicRef.current;

        if (!audio) return;

        audio.volume = 0.15;
        audio.loop = true;

        const restoreMusic = () => {
            const savedPosition = localStorage.getItem(
                "live_music_position"
            );

            if (savedPosition !== null) {
                const position = Number(JSON.parse(savedPosition));

                if (
                    Number.isFinite(position) &&
                    position >= 0 &&
                    position < audio.duration
                ) {
                    audio.currentTime = position;
                }
            }

            if (isMusicMuted) {
                audio.pause();
            } else {
                audio.play().catch((err) => {
                    console.log(
                        "Autoplay bloqueado pelo navegador:",
                        err
                    );
                });
            }
        };

        if (audio.readyState >= 1) {
            restoreMusic();
        } else {
            audio.addEventListener(
                "loadedmetadata",
                restoreMusic,
                { once: true }
            );
        }

        return () => {
            saveMusicPosition();

            audio.removeEventListener(
                "loadedmetadata",
                restoreMusic
            );

            audio.pause();
        };
    }, [isMusicMuted]);

    // Alterna o mute e salva a preferência.
    const toggleBackgroundMusic = () => {
        setIsMusicMuted((currentMuted: boolean) => {
            const nextMuted = !currentMuted;

            localStorage.setItem(
                "mute_ambient:live",
                JSON.stringify(nextMuted)
            );

            return nextMuted;
        });
    };

    // Efeitos sonoros.
    const playSound = (
        audioPath: string,
        volumeLevel = 0.4
    ) => {
        const sound = new Audio(audioPath);
        sound.volume = volumeLevel;

        sound.play().catch((err) =>
            console.log("Erro ao reproduzir áudio:", err)
        );
    };

    // Confirma o power-up e reproduz o som correspondente.
    const handleConfirmPowerUpWithSound = (
        powerupId: any,
        targetPlayerId?: any
    ) => {
        if (
            selectedPowerUp?.powerup_type?.toUpperCase() === "DOUBLE_XP" ||
            selectedPowerUp?.powerup_type?.toUpperCase() === "DOUBLEXP"
        ) {
            playSound("/xp.mp3");
        }

        onConfirmPowerUp(powerupId, targetPlayerId);
    };

    // Som de acerto e de pulo de rodada.
    useEffect(() => {
        const roundFinished = correctAlternative !== null;

        const playerAcertou =
            roundFinished &&
            selectedAnswer !== null &&
            Number(selectedAnswer) === Number(correctAlternative);

        if (playerAcertou) {
            playSound("/acert.mp3");
        }

        if (skip) {
            playSound("/skip.mp3");
        }
    }, [correctAlternative, selectedAnswer, skip]);

    // Som do Fifty.
    useEffect(() => {
        const currentCount = hiddenAlternativeIds?.length ?? 0;
        const prevCount = prevHiddenCountRef.current;

        if (currentCount > 0 && prevCount === 0) {
            playSound("/fifty.mp3");
        }

        prevHiddenCountRef.current = currentCount;
    }, [hiddenAlternativeIds]);

    // Reseta o contador quando a pergunta mudar.
    useEffect(() => {
        prevHiddenCountRef.current = 0;
    }, [question?.id]);

    return (

        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <audio
                ref={bgMusicRef}
                src="/ambiente.mp3"
                preload="auto"
            />

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`
            relative flex h-[100dvh] max-h-[100dvh] w-full
            flex-col overflow-hidden
            font-['Nunito',sans-serif] outline-none
            ${skip
                        ? "ring-4 ring-inset shadow-[inset_0_0_50px_rgba(28,176,246,0.3)]"
                        : ""
                    }
        `}
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    ...(skip
                        ? {
                            "--tw-ring-color": SKIP_COLOR,
                        } as React.CSSProperties
                        : {}),
                }}
            >
                {/* Fundo */}
                <div
                    className="
                pointer-events-none fixed inset-0
                z-0 opacity-[0.10]
            "
                    style={{
                        backgroundImage: `radial-gradient(${colors.pattern} 1.5px, transparent 1.5px)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Progresso da rodada */}
                <div className="relative z-20 w-full shrink-0">
                    <LiveProgressBar
                        progress={progress}
                        isCriticalTime={isCriticalTime}
                        colors={colors}
                    />
                </div>

                {/* Conteúdo principal */}
                <section
                    className="
                relative z-10 mx-auto flex
                min-h-0 w-full max-w-6xl flex-1
                flex-col gap-2
                px-3 py-2
                sm:gap-3 sm:px-5 sm:py-3
                lg:gap-4 lg:px-8
            "
                >
                    {/* Cabeçalho e poderes */}
                    <div className="flex w-full shrink-0 flex-col gap-2 sm:gap-3">
                        <LiveHeader
                            isHost={isHost}
                            timeLeft={timeLeft}
                            isCriticalTime={isCriticalTime}
                            isMusicMuted={isMusicMuted}
                            onToggleMusic={toggleBackgroundMusic}
                            colors={colors}
                        />

                        <LivePowerUps
                            powerUp={powerUp}
                            onSelect={setSelectedPowerUp}
                            colors={colors}
                            time={timeLeft}
                        />
                    </div>

                    {/* Pergunta */}
                    <div className="flex min-h-0 shrink-0 flex-col">
                        <LiveQuestion
                            loading={loading}
                            error={error}
                            question={question}
                            colors={colors}
                            skipColor={SKIP_COLOR}
                        />
                    </div>

                    {/* Alternativas */}
                    <div
                        className="
                    flex min-h-0 w-full flex-1
                    flex-col justify-center
                    px-1 sm:px-2
                "
                    >
                        <LiveAlternatives
                            question={question}
                            selectedAnswer={selectedAnswer}
                            hiddenAlternativeIds={hiddenAlternativeIds}
                            correctAlternative={correctAlternative}
                            answered={answered}
                            isHost={isHost}
                            loading={loading}
                            skip={skip}
                            timeLeft={timeLeft}
                            alternativeStatistics={alternativeStatistics}
                            onAnswer={handleAnswer}
                        />
                    </div>

                    {/* Indicador para o jogador */}
                    <div className="w-full shrink-0">
                        <LivePlayerStatus
                            isHost={isHost}
                            answered={answered}
                            skip={skip}
                            timeLeft={timeLeft}
                            colors={colors}
                            skipColor={SKIP_COLOR}
                        />
                    </div>
                </section>

                {/* Overlay de SKIP */}
                <LiveSkipOverlay
                    skip={skip}
                    playerNameUsed={playerNameUsed}
                    colors={colors}
                    skipColor={SKIP_COLOR}
                />

                {/* Modal de Power-up */}
                <LivePowerUpModal
                    selectedPowerUp={selectedPowerUp}
                    players={players}
                    colors={colors}
                    onClose={() => setSelectedPowerUp(null)}
                    onConfirm={onConfirmPowerUp}
                    onConfirmWithSound={handleConfirmPowerUpWithSound}
                />
            </main>
        </>
    );
};

export default RoomLivePage;
