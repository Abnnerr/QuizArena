
import React, { useEffect, useRef } from "react";
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
    1: "/podium.mp3",
    2: "/podium.mp3",
    3: "/podium.mp3",
};

const PodioPage: React.FC = () => {
    const {
        orderedPodium,
        error,
        visibleCount,
        loading,
        topThree,
        clearRoom,
    } = usePodio();

    const { colors } = useTheme();

    const lastPlayedReveal = useRef(0);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (loading || topThree.length === 0) return;

        if (
            visibleCount <= lastPlayedReveal.current ||
            visibleCount > 3
        ) {
            return;
        }

        const soundPath = PODIUM_SOUNDS[visibleCount];

        if (!soundPath) return;

        // Interrompe o áudio anterior, se ainda estiver tocando.
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(soundPath);

        audio.volume = 0.7;

        audioRef.current = audio;

        // Marca antes de reproduzir para evitar duplicidade.
        lastPlayedReveal.current = visibleCount;

        void audio.play().catch((error) => {
            console.warn("Não foi possível reproduzir o som do pódio:", error);
        });

    }, [visibleCount, loading, topThree.length]);

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
            relative flex min-h-0 w-full flex-1
            flex-col items-center justify-center
            overflow-x-hidden overflow-y-auto
            px-2 py-2
            font-['Nunito',sans-serif]
            select-none
        "
            >
                <div
                    className="
                relative z-10 mx-auto
                flex w-full max-w-3xl
                flex-col gap-2
                my-auto min-h-0
            "
                >
                    {/* CABEÇALHO */}
                    <PodiumHeader colors={colors} />

                    {/* CARD */}
                    <PodiumCard colors={colors}>

                        <FeedbackMessage
                            colors={colors}
                            feedBack={error}
                        />

                        {/* PÓDIO */}
                        {loading ? (
                            <PodiumLoading colors={colors} />
                        ) : topThree.length === 0 ? (
                            <PodiumEmpty colors={colors} />
                        ) : (
                            <div
                                className="
                            grid w-full grid-cols-3
                            items-end gap-1
                            pt-1 pb-1
                            min-h-[140px]
                            sm:min-h-[180px]
                            lg:min-h-[210px]
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

                                        return (
                                            <PodiumPlayer
                                                key={player.player_id}
                                                colors={colors}
                                                player={player}
                                                originalIndex={originalIndex}
                                                visible={
                                                    visibleCount >= revealOrder
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}

                        {/* AÇÕES */}
                        <div className="mt-1">
                            <PodiumActions
                                colors={colors}
                                onClearRoom={() => void clearRoom()}
                            />
                        </div>

                    </PodiumCard>
                </div>
            </main>
        </>
    );
};

export default PodioPage;
