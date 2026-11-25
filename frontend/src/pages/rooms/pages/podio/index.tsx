
import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
    FiAward,
    FiHome,
    FiRefreshCw,
    FiUsers,
} from "react-icons/fi";

import usePodio from "../../hooks/usePodio";
import { AiFillTrophy } from "react-icons/ai";
import { useTheme } from "../../../../contexts/hooks/useTheme";

const PODIUM_SOUNDS: Record<number, string> = {
    1: "/podium.mp3",
    2: "/podium.mp3",
    3: "/podium.mp3",
};

const MEDALS = [
    {
        label: "1º lugar",
        color: "#F59E0B",
        background: "rgba(245, 158, 11, 0.12)",
        height: "h-44 sm:h-52",
        icon: "🥇",
    },
    {
        label: "2º lugar",
        color: "#94A3B8",
        background: "rgba(148, 163, 184, 0.12)",
        height: "h-36 sm:h-44",
        icon: "🥈",
    },
    {
        label: "3º lugar",
        color: "#CD7F32",
        background: "rgba(205, 127, 50, 0.12)",
        height: "h-28 sm:h-36",
        icon: "🥉",
    },
];

export default function PodioPage() {
    const {
        orderedPodium,
        topThree,
        visibleCount,
        loading,
        clearing,
        error,
        clearRoom,
        reloadPodium,
    } = usePodio();

    const { colors } = useTheme();

    const lastPlayedReveal = useRef(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (loading || visibleCount === 0 || topThree.length === 0) {
            return;
        }

        if (
            visibleCount <= lastPlayedReveal.current ||
            visibleCount > topThree.length
        ) {
            return;
        }

        const soundPath = PODIUM_SOUNDS[visibleCount];

        if (!soundPath) return;

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        const audio = new Audio(soundPath);
        audio.volume = 0.7;
        audioRef.current = audio;

        lastPlayedReveal.current = visibleCount;

        void audio.play().catch((err) => {
            console.warn("Não foi possível reproduzir o áudio:", err);
        });
    }, [visibleCount, loading, topThree.length]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        lastPlayedReveal.current = 0;
    }, [topThree]);

    const getMedal = (position: number) => MEDALS[position] ?? MEDALS[2];

    return (
        <>
            <Helmet>
                <title>QuizArena • Resultado Final</title>
            </Helmet>

            <main
                className="relative flex min-h-full w-full flex-1 items-center justify-center overflow-x-hidden overflow-y-auto px-3 py-6 sm:px-6"
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                }}
            >
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                
                    <header className="text-center">
                        <div
                            className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border-2"
                            style={{
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                                color: colors.primary,
                            }}
                        >
                            <AiFillTrophy size={27} />
                        </div>

                        <p
                            className="mb-1 text-xs font-black uppercase tracking-[0.2em]"
                            style={{ color: colors.primary }}
                        >
                            Partida encerrada
                        </p>

                        <h1 className="text-2xl font-black sm:text-3xl">
                            Resultado final
                        </h1>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Confira os grandes vencedores desta partida.
                        </p>
                    </header>

                 
                    <section
                        className="overflow-hidden rounded-3xl border-2 border-b-[6px] p-4 sm:p-6"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                    
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <FiAward
                                    size={20}
                                    style={{ color: colors.primary }}
                                />
                                <h2 className="font-extrabold">
                                    Pódio dos vencedores
                                </h2>
                            </div>

                            {!loading && topThree.length > 0 && (
                                <span
                                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold"
                                    style={{
                                        backgroundColor: colors.surface,
                                        color: colors.muted,
                                    }}
                                >
                                    <FiUsers size={13} />
                                    {topThree.length} jogadores
                                </span>
                            )}
                        </div>

        
                        {error && (
                            <div
                                className="mb-4 flex items-start justify-between gap-3 rounded-xl border p-3 text-sm"
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.danger,
                                    color: colors.danger,
                                }}
                            >
                                <p>{error}</p>

                                <button
                                    type="button"
                                    onClick={() => void reloadPodium()}
                                    className="shrink-0 rounded-lg p-1 transition hover:opacity-70"
                                    title="Tentar novamente"
                                >
                                    <FiRefreshCw size={16} />
                                </button>
                            </div>
                        )}

                       
                        {loading ? (
                            <div className="flex min-h-64 flex-col items-center justify-center gap-3">
                                <div
                                    className="h-9 w-9 animate-spin rounded-full border-[3px] border-t-transparent"
                                    style={{
                                        borderColor: colors.primary,
                                        borderTopColor: "transparent",
                                    }}
                                />

                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: colors.muted }}
                                >
                                    Calculando os resultados...
                                </p>
                            </div>
                        ) : topThree.length === 0 ? (
                          
                            <div className="flex min-h-64 flex-col items-center justify-center text-center">
                                <div
                                    className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                                    style={{
                                        backgroundColor: colors.surface,
                                        color: colors.muted,
                                    }}
                                >
                                    <FiUsers size={28} />
                                </div>

                                <h3 className="font-extrabold">
                                    Nenhum resultado encontrado
                                </h3>

                                <p
                                    className="mt-2 max-w-xs text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Não foi possível encontrar jogadores para
                                    exibir no pódio.
                                </p>
                            </div>
                        ) : (
                            <>
                               
                                <div className="flex min-h-64 items-end justify-center gap-2 pt-5 sm:gap-4">
                                    {orderedPodium.map(
                                        ({
                                            player,
                                            originalIndex,
                                            revealOrder,
                                        }) => {
                                            const medal = getMedal(originalIndex);
                                            const visible =
                                                visibleCount >= revealOrder;

                                            return (
                                                <div
                                                    key={player.player_id}
                                                    className="flex w-1/3 max-w-44 flex-col items-center transition-all duration-700"
                                                    style={{
                                                        opacity: visible ? 1 : 0,
                                                        transform: visible
                                                            ? "translateY(0)"
                                                            : "translateY(35px)",
                                                    }}
                                                >
                                                 
                                                    <div
                                                        className="mb-2 flex h-10 w-10 items-center justify-center rounded-full text-xl sm:h-12 sm:w-12 sm:text-2xl"
                                                        style={{
                                                            backgroundColor:
                                                                medal.background,
                                                        }}
                                                    >
                                                        {medal.icon}
                                                    </div>

                                                   
                                                    <div className="mb-3 w-full text-center">
                                                        <p
                                                            className="truncate text-sm font-extrabold sm:text-base"
                                                            title={
                                                                player.player_name
                                                            }
                                                        >
                                                            {player.player_name}
                                                        </p>

                                                        <p
                                                            className="mt-1 text-xs font-bold sm:text-sm"
                                                            style={{
                                                                color: colors.muted,
                                                            }}
                                                        >
                                                            {player.score.toLocaleString(
                                                                "pt-BR"
                                                            )}{" "}
                                                            XP
                                                        </p>
                                                    </div>

                                                   
                                                    <div
                                                        className={`flex w-full ${medal.height} flex-col items-center justify-start rounded-t-2xl border-2 border-b-0 pt-4`}
                                                        style={{
                                                            backgroundColor:
                                                                medal.background,
                                                            borderColor:
                                                                medal.color,
                                                            color: medal.color,
                                                        }}
                                                    >
                                                        <span className="text-2xl font-black sm:text-3xl">
                                                            {originalIndex + 1}
                                                        </span>

                                                        <span className="mt-1 text-[10px] font-black uppercase tracking-wider sm:text-xs">
                                                            {medal.label}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>

                                
                                <div
                                    className="mt-5 rounded-xl p-3 text-center text-xs font-semibold sm:text-sm"
                                    style={{
                                        backgroundColor: colors.surface,
                                        color: colors.muted,
                                    }}
                                >
                                    {visibleCount < topThree.length
                                        ? "Revelando os vencedores..."
                                        : "Parabéns a todos os participantes!"}
                                </div>
                            </>
                        )}
                    </section>

                    
                    <footer className="flex flex-col-reverse gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={() => void reloadPodium()}
                            disabled={loading || clearing}
                            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-b-4 px-4 py-3 text-sm font-extrabold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                color: colors.text,
                            }}
                        >
                            <FiRefreshCw size={17} />
                            Atualizar resultado
                        </button>

                        <button
                            type="button"
                            onClick={() => void clearRoom()}
                            disabled={clearing || loading}
                            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-b-4 px-4 py-3 text-sm font-extrabold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                            style={{
                                backgroundColor: colors.primary,
                                borderColor: colors.primary,
                            }}
                        >
                            {clearing ? (
                                <>
                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Encerrando...
                                </>
                            ) : (
                                <>
                                    <FiHome size={17} />
                                    Encerrar partida
                                </>
                            )}
                        </button>
                    </footer>
                </div>
            </main>
        </>
    );
}
