
import { Helmet } from "react-helmet-async";
import { useEffect, useRef, useState } from "react";
import {
    FiZap,
    FiSkipForward,
    FiTarget,
    FiX,
    FiCheck,
    FiArrowRight,
    FiClock,
    FiVolumeX,
    FiVolume2,
    FiUsers,
} from "react-icons/fi";
import { useParams } from "react-router";

import useRoomLive from "../../hooks/useRoomLive";
import Button from "../../../../shared/ui/Button";
import Loading from "../../../../shared/pages/Loading";
import { useToast } from "../../../../contexts/hooks/useToast";
import { useTheme } from "../../../../contexts/hooks/useTheme";

const SKIP_COLOR = "#1CB0F6";

type PowerEffect = "FIFTY_FIFTY" | "SKIP_TURN" | "DOUBLE_XP";

const POWER_NAMES: Record<string, string> = {
    DOUBLE_XP: "XP em dobro",
    DOUBLEXP: "XP em dobro",
    SKIP_TURN: "Skip Turn",
    FIFTY_FIFTY: "50/50",
    FIFTY: "50/50",
};

const POWER_COLORS: Record<string, string> = {
    DOUBLE: "#F59E0B",
    SKIP: SKIP_COLOR,
    FIFTY: "#A78BFA",
};

const EFFECT_CONFIG = {
    DOUBLE_XP: {
        title: "XP em dobro ativado!",
        description: "Bônus preparado para a próxima rodada.",
        color: "text-amber-400",
        background: "bg-amber-500/10",
        border: "border-amber-500/40",
        shadow: "shadow-[inset_0_0_0_3px_#F59E0B,inset_0_0_30px_#F59E0B25]",
        icon: <FiZap />,
    },
    FIFTY_FIFTY: {
        title: "50/50 ativado!",
        description: "Duas alternativas foram eliminadas.",
        color: "text-violet-400",
        background: "bg-violet-500/10",
        border: "border-violet-500/40",
        shadow: "shadow-[inset_0_0_0_3px_#A78BFA,inset_0_0_30px_#A78BFA25]",
        icon: <FiTarget />,
    },
    SKIP_TURN: {
        title: "Skip Turn ativado!",
        description: "Sua rodada foi pulada com sucesso.",
        color: "text-sky-400",
        background: "bg-sky-500/10",
        border: "border-sky-500/40",
        shadow: "shadow-[inset_0_0_0_3px_#1CB0F6,inset_0_0_30px_#1CB0F625]",
        icon: <FiSkipForward />,
    },
};

const playSound = (src: string, volume = 0.4) => {
    const audio = new Audio(src);
    audio.volume = volume;
    void audio.play().catch(() => {});
};

const getPowerName = (type: string) =>
    POWER_NAMES[type.toUpperCase()] ?? type;

const getPowerColor = (type: string) => {
    const normalized = type.toUpperCase();

    if (normalized.includes("DOUBLE")) return POWER_COLORS.DOUBLE;
    if (normalized.includes("SKIP")) return POWER_COLORS.SKIP;

    return POWER_COLORS.FIFTY;
};

const getPowerIcon = (type: string) => {
    const normalized = type.toUpperCase();

    if (normalized.includes("DOUBLE")) return <FiZap />;
    if (normalized.includes("SKIP")) return <FiSkipForward />;

    return <FiTarget />;
};

export default function RoomLivePage() {
    const { roomCode } = useParams<{ roomCode: string }>();

    const { colors } = useTheme();
    const { toast } = useToast();

    const {
        handleAnswer,
        handleKeyDown,
        handleEndRound,
        progress,
        isCriticalTime,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
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
        usingPowerUp,
        totalPlayers,
        totalAnswers,
        handleGoToRanking,
    } = useRoomLive();

    const [muted, setMuted] = useState(
        () => localStorage.getItem("mute_ambient:live") !== "false"
    );
    const [target, setTarget] = useState<string | null>(null);
    const [showPowerUp, setShowPowerUp] = useState(false);
    const [effect, setEffect] = useState<PowerEffect | null>(null);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const previousHidden = useRef(0);
    const previousQuestion = useRef<number | null>(null);

    const finished = correctAlternative !== null;
    const answeredCount = totalAnswers ?? 0;
    const playerCount = totalPlayers ?? players.length + 1;

    const card = {
        backgroundColor: colors.card,
        border: `2px solid ${colors.border}`,
        borderBottom: `5px solid ${colors.border}`,
        borderRadius: "20px",
    };

    const surface = {
        backgroundColor: colors.surface,
        border: `2px solid ${colors.border}`,
        borderRadius: "14px",
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.currentTime = Number(
            localStorage.getItem("live_music_position") ?? 0
        );
        audio.volume = 0.15;

        return () => {
            localStorage.setItem(
                "live_music_position",
                String(audio.currentTime)
            );
            audio.pause();
        };
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (muted) {
            audio.pause();
        } else {
            void audio.play().catch(() => {});
        }
    }, [muted]);

    const toggleMusic = () => {
        setMuted(current => {
            localStorage.setItem("mute_ambient:live", String(!current));
            return !current;
        });
    };

    useEffect(() => {
        if (
            selectedAnswer !== null &&
            correctAlternative !== null &&
            selectedAnswer === correctAlternative
        ) {
            playSound("/acert.mp3");
        }
    }, [selectedAnswer, correctAlternative]);

    useEffect(() => {
        if (hiddenAlternativeIds.length > previousHidden.current) {
            playSound("/fifty.mp3");
            setEffect("FIFTY_FIFTY");
        }

        previousHidden.current = hiddenAlternativeIds.length;
    }, [hiddenAlternativeIds]);

    useEffect(() => {
        if (skip) {
            playSound("/skip.mp3");
            setEffect("SKIP_TURN");
        }
    }, [skip]);

    useEffect(() => {
        if (!question || previousQuestion.current === question.id) return;

        previousQuestion.current = question.id;
        previousHidden.current = 0;
        setEffect(null);
    }, [question?.id]);

    useEffect(() => {
        if (!effect) return;

        const timeout = window.setTimeout(() => setEffect(null), 2800);
        return () => window.clearTimeout(timeout);
    }, [effect]);

    const activatePowerUp = async (
        powerupId: number,
        powerType: string,
        targetPlayer?: string
    ) => {
        const success = await onConfirmPowerUp(powerupId, targetPlayer);
        if (!success) return;

        setShowPowerUp(false);
        setSelectedPowerUp(null);
        setTarget(null);

        if (powerType.includes("DOUBLE")) {
            playSound("/xp.mp3");
            setEffect("DOUBLE_XP");
        } else if (powerType.includes("FIFTY")) {
            playSound("/fifty.mp3");
            setEffect("FIFTY_FIFTY");
        } else if (powerType.includes("SKIP")) {
            playSound("/skip.mp3");
            setEffect("SKIP_TURN");
        }
    };

    const openPowerUp = (item: (typeof powerUp)[number]) => {
        if (
            item.used ||
            timeLeft <= 0 ||
            selectedAnswer !== null ||
            skip ||
            loading ||
            usingPowerUp
        ) {
            return;
        }

        const type = item.powerup_type.toUpperCase();
        setSelectedPowerUp(item);
        setTarget(null);

        if (
            type === "FIFTY_FIFTY" ||
            type === "FIFTY" ||
            type.includes("DOUBLE")
        ) {
            void activatePowerUp(item.powerup_id, type);
            return;
        }

        setShowPowerUp(true);
    };

    const closePowerUp = () => {
        if (usingPowerUp) return;

        setShowPowerUp(false);
        setSelectedPowerUp(null);
        setTarget(null);
    };

    const confirmPowerUp = () => {
        if (!selectedPowerUp || !target) {
            toast.warning("Escolha um jogador para continuar.");
            return;
        }

        void activatePowerUp(
            selectedPowerUp.powerup_id,
            selectedPowerUp.powerup_type.toUpperCase(),
            target
        );
    };

    if (loading) {
        return <Loading message="Carregando Partida" />;
    }

    if (!question) {
        return (
            <div
                className="flex min-h-screen items-center justify-center p-4 sm:p-5"
                style={{ backgroundColor: colors.background }}
            >
                <div className="w-full max-w-md p-5 text-center sm:p-7" style={card}>
                    <FiX
                        className="mx-auto mb-4 text-4xl"
                        style={{ color: colors.danger }}
                    />

                    <h2
                        className="mb-2 text-lg font-black sm:text-xl"
                        style={{ color: colors.text }}
                    >
                        Não foi possível carregar a pergunta
                    </h2>

                    <p className="text-sm sm:text-base" style={{ color: colors.muted }}>
                        {error ?? "Aguarde a próxima rodada."}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>Partida ao vivo | Quiz Arena</title>
            </Helmet>

            <audio
                ref={audioRef}
                src="/ambiente.mp3"
                loop
                preload="auto"
            />

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`flex min-h-[100dvh] flex-col outline-none transition-shadow duration-500 ${
                    effect ? EFFECT_CONFIG[effect].shadow : ""
                }`}
                style={{ backgroundColor: colors.background }}
            >
                <div
                    className="h-2 w-full shrink-0"
                    style={{ backgroundColor: colors.border }}
                >
                    <div
                        className="h-full transition-all duration-1000"
                        style={{
                            width: `${progress}%`,
                            backgroundColor: isCriticalTime
                                ? colors.danger
                                : colors.primary,
                        }}
                    />
                </div>

                <header className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex min-w-0 items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                            <img
                                src="/favicon-quiz.png"
                                alt="Quiz Arena"
                                className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
                            />

                            <div className="min-w-0">
                                <p
                                    className="text-sm font-black sm:text-base"
                                    style={{ color: colors.text }}
                                >
                                    QUIZ ARENA
                                </p>

                                <p
                                    className="truncate text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Sala {roomCode}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2 lg:hidden">
                            <button
                                type="button"
                                onClick={toggleMusic}
                                className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-75"
                                style={surface}
                                title={muted ? "Ativar música" : "Desativar música"}
                            >
                                {muted ? (
                                    <FiVolumeX style={{ color: colors.muted }} />
                                ) : (
                                    <FiVolume2 style={{ color: colors.primary }} />
                                )}
                            </button>

                            <div
                                className="flex items-center gap-2 rounded-xl px-2.5 py-2"
                                style={surface}
                            >
                                <FiClock
                                    style={{
                                        color: isCriticalTime
                                            ? colors.danger
                                            : colors.text,
                                    }}
                                />
                                <span
                                    className="text-sm font-black tabular-nums"
                                    style={{
                                        color: isCriticalTime
                                            ? colors.danger
                                            : colors.text,
                                    }}
                                >
                                    {timeLeft}s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 lg:justify-end">
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={toggleMusic}
                                className="hidden h-10 w-10 items-center justify-center rounded-xl transition hover:opacity-75 lg:flex"
                                style={surface}
                                title={muted ? "Ativar música" : "Desativar música"}
                            >
                                {muted ? (
                                    <FiVolumeX style={{ color: colors.muted }} />
                                ) : (
                                    <FiVolume2 style={{ color: colors.primary }} />
                                )}
                            </button>

                            <div
                                className="flex items-center gap-2 rounded-xl px-3 py-2"
                                style={surface}
                            >
                                <FiUsers
                                    className="shrink-0"
                                    style={{ color: colors.primary }}
                                />

                                <span
                                    className="text-sm font-black tabular-nums"
                                    style={{ color: colors.text }}
                                >
                                    {answeredCount}/{playerCount}
                                </span>

                                <span
                                    className="hidden text-xs sm:inline"
                                    style={{ color: colors.muted }}
                                >
                                    responderam
                                </span>
                            </div>
                        </div>

                        {isHost && (
                            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
                                <Button
                                    variant="secondary"
                                    onClick={handleGoToRanking}
                                    disabled={timeLeft > 0}
                                >
                                    <FiUsers />
                                    <span>Ranking</span>
                                </Button>

                                <Button
                                    variant="primary"
                                    onClick={handleEndRound}
                                    disabled={
                                        timeLeft <= 0 ||
                                        finished ||
                                        totalAnswers < totalPlayers
                                    }
                                >
                                    <span>Encerrar</span>
                                    <FiArrowRight />
                                </Button>
                            </div>
                        )}

                        <div
                            className="hidden items-center gap-2 rounded-xl px-3 py-2 font-black lg:flex lg:px-4"
                            style={{
                                backgroundColor: isCriticalTime
                                    ? `${colors.danger}18`
                                    : colors.surface,
                                border: `2px solid ${
                                    isCriticalTime
                                        ? colors.danger
                                        : colors.border
                                }`,
                                color: isCriticalTime
                                    ? colors.danger
                                    : colors.text,
                            }}
                        >
                            <FiClock />
                            <span className="tabular-nums">{timeLeft}s</span>
                        </div>
                    </div>
                </header>

                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-3 pb-6 sm:gap-5 sm:px-6 sm:pb-8">
                    <section className="p-4 sm:p-5" style={card}>
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <div className="min-w-0">
                                <h2
                                    className="text-sm font-black sm:text-base"
                                    style={{ color: colors.text }}
                                >
                                    Seus power-ups
                                </h2>

                                <p
                                    className="mt-1 text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    Use suas vantagens durante a rodada
                                </p>
                            </div>

                            <FiZap
                                className="shrink-0 text-xl"
                                style={{ color: colors.primary }}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {powerUp.map(item => {
                                const color = getPowerColor(item.powerup_type);
                                const disabled =
                                    item.used ||
                                    timeLeft <= 0 ||
                                    selectedAnswer !== null ||
                                    skip ||
                                    usingPowerUp;

                                return (
                                    <button
                                        key={item.powerup_id}
                                        type="button"
                                        disabled={disabled}
                                        onClick={() => openPowerUp(item)}
                                        className="flex min-w-0 items-center gap-3 p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
                                        style={{
                                            backgroundColor: colors.surface,
                                            border: `2px solid ${
                                                item.used ? colors.border : color
                                            }`,
                                            borderBottom: `4px solid ${
                                                item.used ? colors.border : color
                                            }`,
                                            borderRadius: "15px",
                                        }}
                                    >
                                        <span
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl sm:h-11 sm:w-11"
                                            style={{
                                                backgroundColor: `${color}20`,
                                                color,
                                            }}
                                        >
                                            {getPowerIcon(item.powerup_type)}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span
                                                className="block truncate text-sm font-black"
                                                style={{ color: colors.text }}
                                            >
                                                {getPowerName(item.powerup_type)}
                                            </span>

                                            <span
                                                className="mt-1 block text-xs"
                                                style={{ color: colors.muted }}
                                            >
                                                {item.used ? "Já utilizado" : "Disponível"}
                                            </span>
                                        </span>

                                        {item.used ? (
                                            <FiCheck
                                                className="shrink-0"
                                                style={{ color: colors.muted }}
                                            />
                                        ) : (
                                            <FiArrowRight
                                                className="shrink-0"
                                                style={{ color }}
                                            />
                                        )}
                                    </button>
                                );
                            })}

                            {powerUp.length === 0 && (
                                <p
                                    className="col-span-full py-3 text-center text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Você não possui power-ups disponíveis.
                                </p>
                            )}
                        </div>
                    </section>

                    <section className="p-4 sm:p-6 lg:p-8" style={card}>
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
                            <span
                                className="rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider sm:text-xs"
                                style={{
                                    backgroundColor: `${colors.primary}18`,
                                    color: colors.primary,
                                }}
                            >
                                Pergunta da rodada
                            </span>

                            <span
                                className="text-right text-[10px] font-bold sm:text-xs"
                                style={{ color: colors.muted }}
                            >
                                {finished
                                    ? "Resultado da rodada"
                                    : timeLeft > 0
                                      ? "Responda antes do tempo acabar"
                                      : "Aguardando resultado..."}
                            </span>
                        </div>

                        <h1
                            className="break-words py-4 text-center text-lg font-black leading-snug sm:py-5 sm:text-2xl lg:text-3xl"
                            style={{ color: colors.text }}
                        >
                            {question.text}
                        </h1>

                        {error && (
                            <div
                                className="mt-3 rounded-xl p-3 text-sm"
                                style={{
                                    backgroundColor: `${colors.danger}15`,
                                    color: colors.danger,
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </section>

                    {!skip && (
                        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {question.alternatives.map((alternative, index) => {
                                const hidden = hiddenAlternativeIds.includes(
                                    alternative.id
                                );
                                const selected =
                                    selectedAnswer === alternative.id;
                                const stats = alternativeStatistics.find(
                                    item =>
                                        item.alternativeId === alternative.id
                                );

                                const isCorrect =
                                    finished &&
                                    alternative.id === correctAlternative;
                                const isWrong =
                                    finished && selected && !isCorrect;

                                const borderColor = isCorrect
                                    ? colors.success
                                    : isWrong
                                      ? colors.danger
                                      : selected
                                        ? colors.primary
                                        : colors.border;

                                const backgroundColor = isCorrect
                                    ? `${colors.success}18`
                                    : isWrong
                                      ? `${colors.danger}15`
                                      : selected
                                        ? `${colors.primary}15`
                                        : colors.card;

                                return (
                                    <Button
                                        key={alternative.id}
                                        type="button"
                                        disabled={
                                            hidden ||
                                            selectedAnswer !== null ||
                                            isHost ||
                                            timeLeft <= 0 ||
                                            finished
                                        }
                                        variant="secondary"
                                        borderColor={borderColor}
                                        color={backgroundColor}
                                        onClick={() =>
                                            handleAnswer(alternative.id)
                                        }
                                        className={`relative flex min-h-20 w-full items-center gap-3 p-3 text-left transition-all duration-200 sm:min-h-24 sm:gap-4 sm:p-5 ${
                                            hidden
                                                ? "scale-[0.98] cursor-not-allowed opacity-35"
                                                : "hover:-translate-y-0.5"
                                        } disabled:cursor-not-allowed`}
                                    >
                                        <span
                                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-black sm:h-10 sm:w-10"
                                            style={{
                                                backgroundColor: `${colors.primary}18`,
                                                color: colors.primary,
                                            }}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </span>

                                        <span
                                            className={`min-w-0 flex-1 break-words text-left text-sm font-bold sm:text-base ${
                                                hidden ? "line-through" : ""
                                            }`}
                                            style={{ color: colors.text }}
                                        >
                                            {alternative.text}
                                        </span>

                                        {hidden && (
                                            <FiX
                                                className="shrink-0 text-xl"
                                                style={{ color: colors.muted }}
                                            />
                                        )}

                                        {isCorrect && (
                                            <FiCheck
                                                className="shrink-0 text-xl"
                                                style={{ color: colors.success }}
                                            />
                                        )}

                                        {isWrong && (
                                            <FiX
                                                className="shrink-0 text-xl"
                                                style={{ color: colors.danger }}
                                            />
                                        )}

                                        {finished && stats && (
                                            <span
                                                className="shrink-0 text-[10px] font-black tabular-nums sm:text-xs"
                                                style={{ color: colors.muted }}
                                            >
                                                {stats.count} voto(s)
                                            </span>
                                        )}
                                    </Button>
                                );
                            })}
                        </section>
                    )}

                    {skip && (
                        <section
                            className="flex flex-col items-center gap-4 p-5 text-center shadow-lg sm:gap-5 sm:p-8 lg:p-12"
                            style={{
                                ...card,
                                background: `linear-gradient(145deg, ${colors.card}, ${SKIP_COLOR}12)`,
                                borderColor: SKIP_COLOR,
                            }}
                        >
                            <div
                                className="flex h-16 w-16 items-center justify-center rounded-3xl text-3xl shadow-inner sm:h-20 sm:w-20 sm:text-4xl"
                                style={{
                                    color: SKIP_COLOR,
                                    backgroundColor: `${SKIP_COLOR}18`,
                                    border: `2px solid ${SKIP_COLOR}50`,
                                }}
                            >
                                <FiSkipForward />
                            </div>

                            <div>
                                <span
                                    className="text-xs font-black uppercase tracking-widest"
                                    style={{ color: SKIP_COLOR }}
                                >
                                    Skip Turn
                                </span>

                                <h2
                                    className="mt-2 text-xl font-black sm:text-2xl lg:text-3xl"
                                    style={{ color: colors.text }}
                                >
                                    Você pulou esta rodada!
                                </h2>

                                <p
                                    className="mx-auto mt-3 max-w-sm text-sm leading-relaxed"
                                    style={{ color: colors.muted }}
                                >
                                    {playerNameUsed
                                        ? `${playerNameUsed} utilizou um Skip Turn em você.`
                                        : "Você não precisa responder esta pergunta. Aguarde a próxima rodada!"}
                                </p>
                            </div>

                            <div
                                className="rounded-xl border px-4 py-3 text-xs font-bold sm:px-5 sm:text-sm"
                                style={{
                                    backgroundColor: `${SKIP_COLOR}12`,
                                    borderColor: `${SKIP_COLOR}40`,
                                    color: SKIP_COLOR,
                                }}
                            >
                                <FiCheck className="mr-2 inline" />
                                Rodada ignorada com sucesso
                            </div>
                        </section>
                    )}
                </div>

                {effect && (
                    <div
                        className={`fixed right-3 top-16 z-30 flex w-[calc(100%-1.5rem)] items-center gap-3 rounded-2xl border-l-4 p-3 shadow-xl backdrop-blur-md transition-all duration-300 sm:right-6 sm:top-20 sm:w-[340px] ${
                            EFFECT_CONFIG[effect].background
                        } ${EFFECT_CONFIG[effect].border}`}
                    >
                        <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl sm:h-11 sm:w-11 ${
                                EFFECT_CONFIG[effect].color
                            }`}
                        >
                            {EFFECT_CONFIG[effect].icon}
                        </div>

                        <div className="min-w-0">
                            <p
                                className={`text-sm font-black ${
                                    EFFECT_CONFIG[effect].color
                                }`}
                            >
                                {EFFECT_CONFIG[effect].title}
                            </p>

                            <p className="mt-1 text-xs text-white/75">
                                {EFFECT_CONFIG[effect].description}
                            </p>
                        </div>
                    </div>
                )}

                {showPowerUp && selectedPowerUp && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4"
                        onClick={closePowerUp}
                    >
                        <div
                            className="my-auto max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-3xl p-4 shadow-2xl sm:p-6"
                            style={card}
                            onClick={event => event.stopPropagation()}
                        >
                            <div className="mb-5 flex items-start justify-between gap-3">
                                <div className="flex min-w-0 items-center gap-3">
                                    <div
                                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl sm:h-12 sm:w-12"
                                        style={{
                                            backgroundColor: `${SKIP_COLOR}20`,
                                            color: SKIP_COLOR,
                                        }}
                                    >
                                        <FiSkipForward />
                                    </div>

                                    <div className="min-w-0">
                                        <h2
                                            className="text-base font-black sm:text-lg"
                                            style={{ color: colors.text }}
                                        >
                                            Skip Turn
                                        </h2>

                                        <p
                                            className="mt-1 text-xs"
                                            style={{ color: colors.muted }}
                                        >
                                            Escolha quem receberá o efeito
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={closePowerUp}
                                    disabled={usingPowerUp}
                                    className="shrink-0 rounded-lg p-2 transition hover:bg-black/5 disabled:opacity-40"
                                    style={{ color: colors.muted }}
                                >
                                    <FiX />
                                </button>
                            </div>

                            <p
                                className="mb-4 text-sm"
                                style={{ color: colors.muted }}
                            >
                                Escolha um jogador para pular esta rodada.
                            </p>

                            <div className="max-h-56 space-y-2 overflow-y-auto pr-1 sm:max-h-64">
                                {players.map(player => {
                                    const selected =
                                        target === player.player_id;

                                    return (
                                        <button
                                            key={player.player_id}
                                            type="button"
                                            onClick={() =>
                                                setTarget(player.player_id)
                                            }
                                            className="flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition-all duration-200"
                                            style={{
                                                backgroundColor: selected
                                                    ? `${SKIP_COLOR}18`
                                                    : colors.surface,
                                                borderColor: selected
                                                    ? SKIP_COLOR
                                                    : colors.border,
                                            }}
                                        >
                                            <span
                                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                                style={{
                                                    backgroundColor: `${SKIP_COLOR}20`,
                                                    color: SKIP_COLOR,
                                                }}
                                            >
                                                <FiUsers />
                                            </span>

                                            <span
                                                className="min-w-0 flex-1 break-words text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {player.player_name}
                                            </span>

                                            {selected && (
                                                <FiCheck
                                                    className="shrink-0"
                                                    style={{
                                                        color: SKIP_COLOR,
                                                    }}
                                                />
                                            )}
                                        </button>
                                    );
                                })}

                                {players.length === 0 && (
                                    <p
                                        className="py-5 text-center text-sm"
                                        style={{ color: colors.muted }}
                                    >
                                        Nenhum jogador disponível.
                                    </p>
                                )}
                            </div>

                            <div className="mt-5 flex flex-col gap-2 sm:mt-6 sm:flex-row sm:gap-3">
                                <Button
                                    variant="secondary"
                                    fullWidth
                                    onClick={closePowerUp}
                                    disabled={usingPowerUp}
                                >
                                    Cancelar
                                </Button>

                                <Button
                                    variant="primary"
                                    fullWidth
                                    onClick={confirmPowerUp}
                                    disabled={!target || usingPowerUp}
                                    isLoading={usingPowerUp}
                                >
                                    Ativar power-up
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </>
    );
}
