
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
import { useTheme } from "../../../../contexts/ThemeContext";
import { useToast } from "../../../../contexts/ToastContext";
import Button from "../../../../shared/ui/Button";
import Loading from "../../../../shared/pages/Loading";

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

    // Música ambiente
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

    // Sons e efeitos dos power-ups
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

    // Ativação de power-ups
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
                className="min-h-screen flex items-center justify-center p-5"
                style={{ backgroundColor: colors.background }}
            >
                <div className="w-full max-w-md p-7 text-center" style={card}>
                    <FiX
                        className="mx-auto mb-4 text-4xl"
                        style={{ color: colors.danger }}
                    />

                    <h2
                        className="text-xl font-black mb-2"
                        style={{ color: colors.text }}
                    >
                        Não foi possível carregar a pergunta
                    </h2>

                    <p style={{ color: colors.muted }}>
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
                className={`min-h-[100dvh] outline-none flex flex-col transition-shadow duration-500 ${
                    effect ? EFFECT_CONFIG[effect].shadow : ""
                }`}
                style={{ backgroundColor: colors.background }}
            >
                {/* Progresso */}
                <div
                    className="h-2 w-full"
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

                {/* Cabeçalho */}
                <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <img
                            src="/favicon-quiz.png"
                            alt="Quiz Arena"
                            className="w-10 h-10 object-contain"
                        />

                        <div className="min-w-0">
                            <p
                                className="font-black text-sm sm:text-base"
                                style={{ color: colors.text }}
                            >
                                QUIZ ARENA
                            </p>

                            <p
                                className="text-xs truncate"
                                style={{ color: colors.muted }}
                            >
                                Sala {roomCode}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            type="button"
                            onClick={toggleMusic}
                            className="w-10 h-10 rounded-xl flex items-center justify-center transition hover:opacity-75"
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
                            className="flex items-center gap-2 px-3 py-2 rounded-xl"
                            style={surface}
                        >
                            <FiUsers style={{ color: colors.primary }} />

                            <span
                                className="text-sm font-black tabular-nums"
                                style={{ color: colors.text }}
                            >
                                {answeredCount}/{playerCount}
                            </span>

                            <span
                                className="text-xs hidden sm:inline"
                                style={{ color: colors.muted }}
                            >
                                responderam
                            </span>
                        </div>

                        {isHost && (
                            <Button
                                variant="primary"
                                onClick={handleEndRound}
                                disabled={timeLeft <= 0 || finished}
                            >
                                <span className="hidden sm:inline">Encerrar</span>
                                <FiArrowRight />
                            </Button>
                        )}

                        <div
                            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl font-black"
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

                <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-8 flex-1 flex flex-col gap-5">
                    {/* Power-ups */}
                    <section className="p-4 sm:p-5" style={card}>
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <div>
                                <h2
                                    className="font-black text-base"
                                    style={{ color: colors.text }}
                                >
                                    Seus power-ups
                                </h2>

                                <p
                                    className="text-xs mt-1"
                                    style={{ color: colors.muted }}
                                >
                                    Use suas vantagens durante a rodada
                                </p>
                            </div>

                            <FiZap
                                className="text-xl"
                                style={{ color: colors.primary }}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                                        className="p-3 flex items-center gap-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md disabled:opacity-45 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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
                                            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                                            style={{
                                                backgroundColor: `${color}20`,
                                                color,
                                            }}
                                        >
                                            {getPowerIcon(item.powerup_type)}
                                        </span>

                                        <span className="flex-1 min-w-0">
                                            <span
                                                className="block font-black text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                {getPowerName(item.powerup_type)}
                                            </span>

                                            <span
                                                className="block text-xs mt-1"
                                                style={{ color: colors.muted }}
                                            >
                                                {item.used ? "Já utilizado" : "Disponível"}
                                            </span>
                                        </span>

                                        {item.used ? (
                                            <FiCheck style={{ color: colors.muted }} />
                                        ) : (
                                            <FiArrowRight style={{ color }} />
                                        )}
                                    </button>
                                );
                            })}

                            {powerUp.length === 0 && (
                                <p
                                    className="text-sm col-span-full py-3 text-center"
                                    style={{ color: colors.muted }}
                                >
                                    Você não possui power-ups disponíveis.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Pergunta */}
                    <section className="p-5 sm:p-8" style={card}>
                        <div className="flex items-center justify-between gap-3 mb-4">
                            <span
                                className="text-xs font-black uppercase tracking-wider px-3 py-2 rounded-lg"
                                style={{
                                    backgroundColor: `${colors.primary}18`,
                                    color: colors.primary,
                                }}
                            >
                                Pergunta da rodada
                            </span>

                            <span
                                className="text-xs font-bold"
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
                            className="text-xl sm:text-3xl font-black leading-snug text-center py-5"
                            style={{ color: colors.text }}
                        >
                            {question.text}
                        </h1>

                        {error && (
                            <div
                                className="mt-3 p-3 rounded-xl text-sm"
                                style={{
                                    backgroundColor: `${colors.danger}15`,
                                    color: colors.danger,
                                }}
                            >
                                {error}
                            </div>
                        )}
                    </section>

                    {/* Alternativas */}
                    {!skip && (
                        <section className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {question.alternatives.map((alternative, index) => {
                                const hidden = hiddenAlternativeIds.includes(alternative.id);
                                const selected = selectedAnswer === alternative.id;
                                const stats = alternativeStatistics.find(
                                    item => item.alternativeId === alternative.id
                                );

                                const isCorrect =
                                    finished && alternative.id === correctAlternative;
                                const isWrong = finished && selected && !isCorrect;

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
                                    <button
                                        key={alternative.id}
                                        type="button"
                                        disabled={
                                            hidden ||
                                            selectedAnswer !== null ||
                                            timeLeft <= 0 ||
                                            finished
                                        }
                                        onClick={() => handleAnswer(alternative.id)}
                                        className={`relative min-h-24 p-4 sm:p-5 flex items-center gap-4 text-left transition-all duration-200 ${
                                            hidden
                                                ? "opacity-35 scale-[0.98] cursor-not-allowed"
                                                : "hover:-translate-y-0.5"
                                        } disabled:cursor-not-allowed`}
                                        style={{
                                            backgroundColor,
                                            border: `2px solid ${borderColor}`,
                                            borderBottom: `5px solid ${borderColor}`,
                                            borderRadius: "18px",
                                        }}
                                    >
                                        <span
                                            className="w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0"
                                            style={{
                                                backgroundColor: `${colors.primary}18`,
                                                color: colors.primary,
                                            }}
                                        >
                                            {String.fromCharCode(65 + index)}
                                        </span>

                                        <span
                                            className={`flex-1 font-bold text-sm sm:text-base ${
                                                hidden ? "line-through" : ""
                                            }`}
                                            style={{ color: colors.text }}
                                        >
                                            {alternative.text}
                                        </span>

                                        {hidden && (
                                            <FiX
                                                className="text-xl"
                                                style={{ color: colors.muted }}
                                            />
                                        )}

                                        {isCorrect && (
                                            <FiCheck
                                                className="text-xl"
                                                style={{ color: colors.success }}
                                            />
                                        )}

                                        {isWrong && (
                                            <FiX
                                                className="text-xl"
                                                style={{ color: colors.danger }}
                                            />
                                        )}

                                        {finished && stats && (
                                            <span
                                                className="text-xs font-black tabular-nums"
                                                style={{ color: colors.muted }}
                                            >
                                                {stats.count} voto(s)
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </section>
                    )}

                    {/* Skip Turn */}
                    {skip && (
                        <section
                            className="p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-lg animate-pulse"
                            style={{
                                ...card,
                                background: `linear-gradient(145deg, ${colors.card}, ${SKIP_COLOR}12)`,
                                borderColor: SKIP_COLOR,
                            }}
                        >
                            <div
                                className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-inner"
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
                                    className="text-2xl sm:text-3xl font-black mt-2"
                                    style={{ color: colors.text }}
                                >
                                    Você pulou esta rodada!
                                </h2>

                                <p
                                    className="text-sm mt-3 max-w-sm mx-auto leading-relaxed"
                                    style={{ color: colors.muted }}
                                >
                                    {playerNameUsed
                                        ? `${playerNameUsed} utilizou um Skip Turn em você.`
                                        : "Você não precisa responder esta pergunta. Aguarde a próxima rodada!"}
                                </p>
                            </div>

                            <div
                                className="px-5 py-3 rounded-xl text-sm font-bold border"
                                style={{
                                    backgroundColor: `${SKIP_COLOR}12`,
                                    borderColor: `${SKIP_COLOR}40`,
                                    color: SKIP_COLOR,
                                }}
                            >
                                <FiCheck className="inline mr-2" />
                                Rodada ignorada com sucesso
                            </div>
                        </section>
                    )}
                </div>

                {/* Notificação de power-up */}
                {effect && (
                    <div
                        className={`fixed top-20 right-4 sm:right-6 z-30 w-[calc(100%-2rem)] sm:w-[340px] flex items-center gap-3 p-3 rounded-2xl border-l-4 shadow-xl backdrop-blur-md pointer-events-none transition-all duration-300 ${EFFECT_CONFIG[effect].background} ${EFFECT_CONFIG[effect].border}`}
                    >
                        <div
                            className={`w-11 h-11 shrink-0 rounded-xl flex items-center justify-center text-xl ${EFFECT_CONFIG[effect].color} bg-white/10`}
                        >
                            {EFFECT_CONFIG[effect].icon}
                        </div>

                        <div className="min-w-0">
                            <p className={`font-black text-sm ${EFFECT_CONFIG[effect].color}`}>
                                {EFFECT_CONFIG[effect].title}
                            </p>

                            <p className="text-xs mt-1 text-white/75">
                                {EFFECT_CONFIG[effect].description}
                            </p>
                        </div>
                    </div>
                )}

                {/* Modal Skip Turn */}
                {showPowerUp && selectedPowerUp && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={closePowerUp}
                    >
                        <div
                            className="w-full max-w-md p-5 sm:p-6 rounded-3xl shadow-2xl"
                            style={card}
                            onClick={event => event.stopPropagation()}
                        >
                            <div className="flex items-start justify-between gap-3 mb-5">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                                        style={{
                                            backgroundColor: `${SKIP_COLOR}20`,
                                            color: SKIP_COLOR,
                                        }}
                                    >
                                        <FiSkipForward />
                                    </div>

                                    <div>
                                        <h2
                                            className="font-black text-lg"
                                            style={{ color: colors.text }}
                                        >
                                            Skip Turn
                                        </h2>

                                        <p
                                            className="text-xs mt-1"
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
                                    className="p-2 rounded-lg hover:bg-black/5 transition disabled:opacity-40"
                                    style={{ color: colors.muted }}
                                >
                                    <FiX />
                                </button>
                            </div>

                            <p
                                className="text-sm mb-4"
                                style={{ color: colors.muted }}
                            >
                                Escolha um jogador para pular esta rodada.
                            </p>

                            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                                {players.map(player => {
                                    const selected = target === player.player_id;

                                    return (
                                        <button
                                            key={player.player_id}
                                            type="button"
                                            onClick={() => setTarget(player.player_id)}
                                            className="w-full flex items-center gap-3 p-3 text-left rounded-xl border-2 transition-all duration-200"
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
                                                className="w-9 h-9 rounded-full flex items-center justify-center"
                                                style={{
                                                    backgroundColor: `${SKIP_COLOR}20`,
                                                    color: SKIP_COLOR,
                                                }}
                                            >
                                                <FiUsers />
                                            </span>

                                            <span
                                                className="flex-1 font-bold text-sm"
                                                style={{ color: colors.text }}
                                            >
                                                {player.player_name}
                                            </span>

                                            {selected && (
                                                <FiCheck style={{ color: SKIP_COLOR }} />
                                            )}
                                        </button>
                                    );
                                })}

                                {players.length === 0 && (
                                    <p
                                        className="text-center text-sm py-5"
                                        style={{ color: colors.muted }}
                                    >
                                        Nenhum jogador disponível.
                                    </p>
                                )}
                            </div>

                            <div className="flex gap-3 mt-6">
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
