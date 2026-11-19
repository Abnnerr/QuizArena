
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
                    {/* Cabeçalho */}
                    <PodiumHeader colors={colors} />

                    {/* Card principal */}
                    <PodiumCard colors={colors}>

                        {/* Erro */}
                        <FeedbackMessage
                            colors={colors}
                            feedBack={error}
                        />

                        {/* Conteúdo do pódio */}
                        {loading ? (
                            <PodiumLoading colors={colors} />
                        ) : topThree.length === 0 ? (
                            <PodiumEmpty colors={colors} />
                        ) : (
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
                                            visibleCount >= revealOrder;

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
                        )}

                        {/* Ações */}
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
