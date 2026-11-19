
import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";

import usePodio from "../../hooks/usePodio";
import { useTheme } from "../../../../contexts/ThemeContext";

import { PodiumHeader } from "./components/PodiumHeader";
import { PodiumCard } from "./components/PodiumCard";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import { PodiumLoading } from "./components/PodiumLoading";
import { PodiumEmpty } from "./components/PodiumEmpty";
import { PodiumPlayer } from "./components/PodiumPlayer";
import { PodiumActions } from "./components/PodiumActions";

const PODIUM_SOUNDS: Record<number, string> = {
    1: "/podium.mp3", // Terceiro lugar
    2: "/podium.mp3", // Segundo lugar
    3: "/podium.mp3", // Primeiro lugar
};

const REVEAL_DELAY = 2500;

const PodioPage: React.FC = () => {
    const {
        orderedPodium,
        error,
        loading,
        topThree,
        clearRoom,
    } = usePodio();

    const { colors } = useTheme();

    const [revealedCount, setRevealedCount] = useState(0);
    const [audioEnabled, setAudioEnabled] = useState(false);
    const [started, setStarted] = useState(false);

    const lastPlayedReveal = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Inicia a sequência de suspense depois da interação do usuário.
    useEffect(() => {
        if (loading || topThree.length === 0 || !started) return;

        setRevealedCount(0);
        lastPlayedReveal.current = 0;

        const timers: ReturnType<typeof setTimeout>[] = [];

        // Terceiro lugar.
        timers.push(
            setTimeout(() => {
                setRevealedCount(1);
            }, 1000)
        );

        // Segundo lugar.
        timers.push(
            setTimeout(() => {
                setRevealedCount(2);
            }, 1000 + REVEAL_DELAY)
        );

        // Primeiro lugar.
        timers.push(
            setTimeout(() => {
                setRevealedCount(3);
            }, 1000 + REVEAL_DELAY * 2)
        );

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [loading, topThree.length, started]);

    // Desbloqueia o áudio através de uma interação real.
    const handleStartPodium = async () => {
        const audio = new Audio(PODIUM_SOUNDS[1]);

        try {
            audio.volume = 0;

            await audio.play();

            audio.pause();
            audio.currentTime = 0;

            setAudioEnabled(true);
            setStarted(true);
        } catch (error) {
            console.warn(
                "Não foi possível liberar o áudio:",
                error
            );

            setAudioEnabled(false);
        }
    };

    // Reproduz o som de cada posição revelada.
    useEffect(() => {
        if (
            !audioEnabled ||
            revealedCount <= lastPlayedReveal.current ||
            revealedCount > 3
        ) {
            return;
        }

        const soundPath = PODIUM_SOUNDS[revealedCount];

        if (!soundPath) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(soundPath);

        audio.volume = 0.7;
        audioRef.current = audio;

        lastPlayedReveal.current = revealedCount;

        void audio.play().catch((error) => {
            console.warn(
                "Não foi possível reproduzir o som do pódio:",
                error
            );
        });
    }, [revealedCount, audioEnabled]);

    // Limpa o áudio quando sair da página.
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <>
            <Helmet>
                <title>QuizArena • Fim de Partida • Pódio Final</title>
            </Helmet>

            <main
                className="
                    w-full flex-1 min-h-0
                    flex flex-col items-center justify-center
                    overflow-hidden
                    px-3 py-2 sm:px-5 sm:py-3
                    font-['Nunito',sans-serif]
                    select-none
                "
            >
                <div
                    className="
                        w-full max-w-4xl relative z-10
                        flex flex-col
                        gap-3 sm:gap-4
                        my-auto
                        min-h-0
                    "
                >
                    <PodiumHeader colors={colors} />

                    <PodiumCard colors={colors}>
                        <FeedbackMessage
                            colors={colors}
                            feedBack={error}
                        />

                        {loading ? (
                            <PodiumLoading colors={colors} />
                        ) : topThree.length === 0 ? (
                            <PodiumEmpty colors={colors} />
                        ) : (
                            <>
                                {!started && (
                                    <div className="flex flex-col items-center gap-3 py-5">
                                        <span className="text-4xl">
                                            🏆
                                        </span>

                                        <p
                                            className="text-center font-black uppercase tracking-wide"
                                            style={{ color: colors.text }}
                                        >
                                            A hora da verdade chegou!
                                        </p>

                                        <button
                                            type="button"
                                            onClick={handleStartPodium}
                                            className="
                                                w-full sm:w-auto
                                                px-8 py-4
                                                rounded-2xl
                                                border-2 border-b-4
                                                font-black uppercase
                                                tracking-wide
                                                text-white
                                                bg-blue-500
                                                border-blue-700
                                                hover:bg-blue-600
                                                active:translate-y-1
                                                active:border-b-2
                                                transition-all
                                            "
                                        >
                                            <span className="mr-2">
                                                🏆
                                            </span>
                                            Revelar pódio
                                        </button>
                                    </div>
                                )}

                                <div
                                    className="
                                        grid grid-cols-3
                                        gap-2 sm:gap-4
                                        items-end
                                        pt-3 sm:pt-4
                                        pb-2
                                        min-h-[210px]
                                        sm:min-h-[260px]
                                        lg:min-h-[290px]
                                    "
                                >
                                    {orderedPodium.map(
                                        ({ player, originalIndex }) => {
                                            const revealOrder =
                                                originalIndex === 2
                                                    ? 1
                                                    : originalIndex === 1
                                                        ? 2
                                                        : 3;

                                            const isVisible =
                                                revealedCount >= revealOrder;

                                            return (
                                                <PodiumPlayer
                                                    key={player.player_id}
                                                    colors={colors}
                                                    player={player}
                                                    originalIndex={originalIndex}
                                                    visible={isVisible}
                                                />
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        )}

                        <PodiumActions
                            colors={colors}
                            onClearRoom={() => void clearRoom()}
                        />
                    </PodiumCard>
                </div>
            </main>
        </>
    );
};

export default PodioPage;
