
import { Helmet } from "react-helmet-async";
import {
    BsTriangleFill,
    BsSquareFill,
    BsCircleFill,
    BsDiamondFill,
    BsClockHistory,
    BsLightningFill,
    BsX,
    BsChevronDown,
    BsVolumeMuteFill,
    BsVolumeUpFill,
} from "react-icons/bs";
import useRoomLive from "../hooks/useRoomLive";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../contexts/ThemeContext";

const SKIP_COLOR = "#1CB0F6";

const ALTERNATIVE_STYLES = [
    {
        color: "bg-[#E21B3C] hover:bg-[#c41532] text-white border-[#9E1328]",
        icon: BsTriangleFill,
    },
    {
        color: "bg-[#1368CE] hover:bg-[#0f53a8] text-white border-[#0B3E7A]",
        icon: BsDiamondFill,
    },
    {
        color: "bg-[#D89E00] hover:bg-[#b08100] text-white border-[#805E00]",
        icon: BsCircleFill,
    },
    {
        color: "bg-[#26890C] hover:bg-[#1f6e0a] text-white border-[#174F07]",
        icon: BsSquareFill,
    },
];

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
        playerNameUsed
    } = useRoomLive();

    const { colors } = useTheme();



    const [isMusicMuted, setIsMusicMuted] = useState(() => {
        const savedMute = localStorage.getItem("mute_ambient:live");

        return savedMute !== null ? JSON.parse(savedMute) : false;
    });

    const prevHiddenCountRef = useRef(0);
    const bgMusicRef = useRef<HTMLAudioElement | null>(null);

    // Salva a posição atual da música
    const saveMusicPosition = () => {
        const audio = bgMusicRef.current;

        if (!audio || !Number.isFinite(audio.currentTime)) return;

        localStorage.setItem(
            "live_music_position",
            JSON.stringify(audio.currentTime)
        );
    };

    // Controla a música e restaura a posição salva
    useEffect(() => {
        const audio = bgMusicRef.current;

        if (!audio) return;

        audio.volume = 0.15;
        audio.loop = true;

        const restoreMusic = () => {
            const savedPosition = localStorage.getItem("live_music_position");

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
                    console.log("Autoplay bloqueado pelo navegador:", err);
                });
            }
        };

        if (audio.readyState >= 1) {
            restoreMusic();
        } else {
            audio.addEventListener("loadedmetadata", restoreMusic, {
                once: true,
            });
        }

        return () => {
            saveMusicPosition();

            audio.removeEventListener("loadedmetadata", restoreMusic);
            audio.pause();
        };
    }, [isMusicMuted]);

    // Alterna o mute e salva a preferência
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

    // Efeitos sonoros
    const playSound = (audioPath: string, volumeLevel = 0.4) => {
        const sound = new Audio(audioPath);
        sound.volume = volumeLevel;

        sound.play().catch((err) =>
            console.log("Erro ao reproduzir áudio:", err)
        );
    };

    // Confirma o power-up e reproduz o som correspondente
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

    // Som de acerto e de pulo de rodada
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

    // Som do Fifty
    useEffect(() => {
        const currentCount = hiddenAlternativeIds?.length ?? 0;
        const prevCount = prevHiddenCountRef.current;

        if (currentCount > 0 && prevCount === 0) {
            playSound("/fifty.mp3");
        }

        prevHiddenCountRef.current = currentCount;
    }, [hiddenAlternativeIds]);

    // Reseta o contador quando a pergunta mudar
    useEffect(() => {
        prevHiddenCountRef.current = 0;
    }, [question?.id]);

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <audio ref={bgMusicRef} src="/ambiente.mp3" preload="auto" />

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`
                    relative flex min-h-[100dvh] w-full flex-col
                    overflow-x-hidden font-['Nunito',sans-serif]
                    outline-none
                    ${skip
                        ? "ring-4 ring-inset shadow-[inset_0_0_50px_rgba(28,176,246,0.3)]"
                        : ""
                    }
                `}
                style={{
                    backgroundColor: colors.background,
                    color: colors.text,
                    ...(skip ? { "--tw-ring-color": SKIP_COLOR } as React.CSSProperties : {}),
                }}
            >
                {/* Fundo */}
                <div
                    className="pointer-events-none fixed inset-0 z-0 opacity-[0.10]"
                    style={{
                        backgroundImage: `radial-gradient(${colors.pattern} 1.5px, transparent 1.5px)`,
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Progresso da rodada */}
                <div
                    className="relative z-20 h-2 w-full shrink-0 sm:h-3"
                    style={{ backgroundColor: colors.border }}
                >
                    <div
                        className={`
                            h-full transition-all duration-1000 ease-linear
                            ${isCriticalTime ? "animate-pulse" : ""}
                        `}
                        style={{
                            width: `${Math.max(0, progress)}%`,
                            backgroundColor: isCriticalTime
                                ? colors.danger
                                : colors.primary,
                        }}
                    />
                </div>

                {/* Conteúdo principal */}
                <section className="
                    relative z-10 mx-auto flex w-full max-w-5xl
                    flex-1 flex-col gap-5 px-3 py-5
                    sm:gap-7 sm:px-6 sm:py-7
                    lg:gap-8 lg:px-8
                ">

                    {/* Cabeçalho */}
                    <header className="flex w-full flex-col gap-3">

                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p
                                    className="
                                        text-[10px] font-black uppercase
                                        tracking-[0.2em] sm:text-xs
                                    "
                                    style={{ color: colors.muted }}
                                >
                                    Quiz Arena
                                </p>

                                <h2
                                    className="text-base font-black tracking-tight sm:text-xl"
                                    style={{ color: colors.text }}
                                >
                                    Partida ao vivo
                                </h2>
                            </div>

                            {/* Controles */}
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={toggleBackgroundMusic}
                                    aria-label={
                                        isMusicMuted
                                            ? "Ligar música ambiente"
                                            : "Desligar música ambiente"
                                    }
                                    className="
                                        flex h-14 items-center justify-center gap-1.5
                                        rounded-xl border-2 border-b-4
                                        px-3 py-2 text-xs font-black
                                        transition-all hover:brightness-110
                                        active:translate-y-0.5 active:border-b-2
                                        sm:px-4 sm:py-3 sm:text-sm
                                    "
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        color: colors.primary,
                                    }}
                                >
                                    {isMusicMuted
                                        ? <BsVolumeMuteFill className="w-5 h-5" />
                                        : <BsVolumeUpFill className="w-5 h-5" />
                                    }
                                </button>

                                {isHost && (
                                    <div
                                        className="
                                            flex items-center gap-2
                                            rounded-xl border-2 border-b-4
                                            px-3 py-2 sm:px-5 sm:py-3
                                        "
                                        style={{
                                            backgroundColor: isCriticalTime
                                                ? `${colors.danger}20`
                                                : colors.card,
                                            borderColor: isCriticalTime
                                                ? colors.danger
                                                : colors.primary,
                                            color: isCriticalTime
                                                ? colors.danger
                                                : colors.primary,
                                        }}
                                    >
                                        <BsClockHistory className="
                                            h-4 w-4 shrink-0 sm:h-5 sm:w-5
                                        " />

                                        <span className="
                                            whitespace-nowrap text-sm
                                            font-black sm:text-xl
                                        ">
                                            {timeLeft}s
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Power-ups */}
                        {powerUp && powerUp.length > 0 && (
                            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                {powerUp.slice(0, 3).map((item: any, idx: number) => (
                                    <button
                                        key={item.powerup_id ?? idx}
                                        type="button"
                                        disabled={item.used === true}
                                        onClick={() => setSelectedPowerUp(item)}
                                        className={`
                                            flex min-h-[48px] min-w-0 items-center
                                            justify-center gap-2 rounded-xl
                                            border-2 border-b-4 px-2 py-2
                                            text-[10px] font-black transition-all
                                            sm:min-h-[58px] sm:rounded-2xl
                                            sm:px-4 sm:text-sm
                                            ${item.used
                                                ? "cursor-not-allowed opacity-50"
                                                : "cursor-pointer hover:brightness-110 active:translate-y-0.5 active:border-b-2"
                                            }
                                        `}
                                        style={{
                                            backgroundColor: colors.card,
                                            borderColor: item.used
                                                ? colors.border
                                                : colors.primary,
                                            color: item.used
                                                ? colors.muted
                                                : colors.primary,
                                        }}
                                    >
                                        <BsLightningFill
                                            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                                        />

                                        <span className="truncate capitalize">
                                            {item.powerup_type}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </header>

                    {/* Pergunta */}
                    <section
                        className="
                            flex min-h-[170px] w-full flex-1
                            flex-col items-center justify-center
                            rounded-2xl border-2 border-b-4
                            px-4 py-7 text-center shadow-lg
                            sm:min-h-[220px] sm:rounded-3xl
                            sm:border-b-8 sm:px-10 sm:py-10
                            lg:min-h-[250px]
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        {loading ? (
                            <div className="flex flex-col items-center gap-4">
                                <div
                                    className="
                                        h-8 w-8 animate-spin rounded-full
                                        border-4 border-t-transparent
                                        sm:h-10 sm:w-10
                                    "
                                    style={{
                                        borderColor: SKIP_COLOR,
                                        borderTopColor: "transparent",
                                    }}
                                />

                                <p
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider sm:text-base
                                    "
                                    style={{ color: colors.muted }}
                                >
                                    Carregando partida...
                                </p>
                            </div>
                        ) : error ? (
                            <p
                                className="text-base font-black sm:text-xl"
                                style={{ color: colors.danger }}
                            >
                                {error}
                            </p>
                        ) : question ? (
                            <div className="w-full">
                                <span
                                    className="
                                        mb-4 inline-block rounded-full
                                        px-4 py-1.5 text-[10px]
                                        font-black uppercase tracking-widest
                                        sm:text-xs
                                    "
                                    style={{
                                        backgroundColor: colors.surface,
                                        color: colors.primary,
                                    }}
                                >
                                    Pergunta
                                </span>

                                <h1
                                    className="
                                        break-words text-lg font-black
                                        leading-snug tracking-tight
                                        sm:text-2xl md:text-3xl lg:text-4xl
                                    "
                                    style={{ color: colors.text }}
                                >
                                    {question.text}
                                </h1>
                            </div>
                        ) : (
                            <p
                                className="
                                    text-sm font-black uppercase
                                    tracking-wider sm:text-xl
                                "
                                style={{ color: colors.muted }}
                            >
                                Aguardando a próxima pergunta...
                            </p>
                        )}
                    </section>

                    {/* Alternativas */}
                    <section className="
                        grid w-full grid-cols-1 gap-3
                        sm:grid-cols-2 sm:gap-4 lg:gap-5
                    ">
                        {question?.alternatives.map((alternative: any, index: number) => {
                            const style = ALTERNATIVE_STYLES[
                                index % ALTERNATIVE_STYLES.length
                            ];

                            const IconComponent = style.icon;

                            const isSelected = selectedAnswer === alternative.id;

                            const isEliminated = hiddenAlternativeIds?.includes(
                                alternative.id
                            );

                            const statistics = alternativeStatistics.find(
                                item =>
                                    Number(item.alternativeId) ===
                                    Number(alternative.id)
                            );

                            const isCorrect =
                                correctAlternative !== null &&
                                Number(correctAlternative) === Number(alternative.id);

                            const roundFinished = correctAlternative !== null;

                            return (
                                <button
                                    key={alternative.id}
                                    type="button"
                                    disabled={
                                        isHost ||
                                        loading ||
                                        skip ||
                                        answered ||
                                        timeLeft <= 0 ||
                                        isEliminated ||
                                        roundFinished
                                    }
                                    onClick={() => handleAnswer(alternative.id)}
                                    className={`
                                        group relative flex min-h-[76px] w-full
                                        items-center rounded-2xl border-2
                                        border-b-4 p-3 text-left
                                        transition-all duration-200
                                        sm:min-h-[110px] sm:p-4
                                        lg:min-h-[125px] lg:p-5
                                        ${style.color}

                                        ${isCorrect
                                            ? "z-10 scale-[1.02] ring-4 ring-white/90 shadow-xl"
                                            : ""
                                        }

                                        ${!roundFinished && (isSelected || skip)
                                            ? "translate-y-1 border-b-2 ring-4 ring-[#1CB0F6]/50"
                                            : ""
                                        }

                                        ${isHost
                                            ? "cursor-default"
                                            : "cursor-pointer active:translate-y-1 active:border-b-2"
                                        }

                                        ${isEliminated && !roundFinished
                                            ? "cursor-not-allowed opacity-30 grayscale"
                                            : ""
                                        }

                                        ${answered && !isSelected && !isCorrect
                                            ? "opacity-40 grayscale-[50%]"
                                            : ""
                                        }

                                        ${roundFinished && !isCorrect
                                            ? "opacity-35 grayscale"
                                            : ""
                                        }

                                        disabled:cursor-not-allowed
                                    `}
                                >
                                    <div
                                        className={`
                                            flex w-full min-w-0 items-center
                                            gap-3 sm:gap-4
                                            ${isHost ? "justify-start" : "justify-center"}
                                        `}
                                    >
                                        {/* Ícone */}
                                        <div className="
                                            flex h-10 w-10 shrink-0
                                            items-center justify-center
                                            rounded-xl border-b-2
                                            border-black/30 bg-black/20
                                            sm:h-14 sm:w-14 sm:rounded-2xl
                                        ">
                                            {isCorrect ? (
                                                <span className="
                                                    text-xl font-black text-white
                                                    sm:text-3xl
                                                ">
                                                    ✓
                                                </span>
                                            ) : (
                                                <IconComponent className="
                                                    h-5 w-5 text-white
                                                    sm:h-7 sm:w-7
                                                " />
                                            )}
                                        </div>

                                        {/* Texto */}
                                        <span className="
                                            min-w-0 flex-1 break-words
                                            text-sm font-black leading-snug
                                            tracking-wide text-white
                                            sm:text-base lg:text-lg
                                        ">
                                            {alternative.text}
                                        </span>

                                        {/* Estatísticas */}
                                        {roundFinished && (
                                            <span className="
                                                shrink-0 rounded-lg
                                                bg-black/20 px-2.5 py-1.5
                                                text-xs font-black text-white
                                                sm:text-base
                                            ">
                                                {statistics?.count ?? 0}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </section>

                    {/* Indicador para o jogador */}
                    {!isHost && (
                        <div className="pb-1 text-center">
                            {answered ? (
                                <p
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider sm:text-sm
                                    "
                                    style={{ color: colors.success }}
                                >
                                    <span className="mr-1">✓</span>
                                    Resposta enviada!
                                </p>
                            ) : skip ? (
                                <p
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider sm:text-sm
                                    "
                                    style={{ color: SKIP_COLOR }}
                                >
                                    Sua vez foi pulada nesta rodada
                                </p>
                            ) : timeLeft <= 0 ? (
                                <p
                                    className="
                                        text-xs font-black uppercase
                                        tracking-wider sm:text-sm
                                    "
                                    style={{ color: colors.danger }}
                                >
                                    Tempo esgotado!
                                </p>
                            ) : (
                                <p
                                    className="text-xs font-bold sm:text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Escolha uma alternativa para responder
                                </p>
                            )}
                        </div>
                    )}
                </section>

                {/* Overlay de SKIP */}
                {skip && (
                    <div
                        className="
                            fixed inset-0 z-[60] flex items-center
                            justify-center bg-black/75 p-4
                            backdrop-blur-sm animate-in fade-in duration-200
                        "
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="skip-title"
                    >
                        <div
                            className="
                                w-full max-w-sm space-y-5 rounded-3xl
                                border-2 border-b-8 p-6 text-center
                                shadow-2xl animate-in zoom-in-95 duration-300
                                sm:p-8
                            "
                            style={{
                                backgroundColor: colors.card,
                                borderColor: SKIP_COLOR,
                            }}
                        >
                            <div
                                className="
                                    mx-auto flex h-16 w-16 items-center
                                    justify-center rounded-2xl border-2
                                    border-b-4
                                "
                                style={{
                                    backgroundColor: `${SKIP_COLOR}18`,
                                    borderColor: SKIP_COLOR,
                                    color: SKIP_COLOR,
                                }}
                            >
                                <BsChevronDown className="h-8 w-8 animate-bounce" />
                            </div>

                            <div className="space-y-2">
                                <h3
                                    id="skip-title"
                                    className="
                                        text-xl font-black uppercase
                                        tracking-wide
                                    "
                                    style={{ color: colors.text }}
                                >
                                    Vez pulada!
                                </h3>

                                <p
                                    className="
                                        text-sm font-extrabold leading-relaxed
                                    "
                                    style={{ color: colors.muted }}
                                >
                                    {playerNameUsed ? (
                                        <>
                                            <span style={{ color: colors.primary }}>
                                                {playerNameUsed}
                                            </span>{" "}
                                            usou um poder e pulou a sua vez nesta rodada.
                                        </>
                                    ) : (
                                        "Você teve sua rodada pulada por um efeito especial."
                                    )}
                                </p>
                            </div>

                            <div
                                className="
                                    h-2 w-full overflow-hidden rounded-full
                                "
                                style={{ backgroundColor: colors.surface }}
                            >
                                <div
                                    className="
                                        h-full w-full animate-pulse
                                    "
                                    style={{ backgroundColor: SKIP_COLOR }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal responsivo de Power-up */}
                {selectedPowerUp && (
                    <div
                        className="
                            fixed inset-0 z-50 flex items-end
                            justify-center bg-black/75 p-0
                            backdrop-blur-sm animate-in fade-in duration-200
                            sm:items-center sm:p-4
                        "
                        onClick={() => setSelectedPowerUp(null)}
                    >
                        <div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="powerup-title"
                            onClick={e => e.stopPropagation()}
                            className="
                                relative max-h-[85dvh] w-full max-w-md
                                space-y-5 overflow-y-auto rounded-t-3xl
                                border-t-4 p-5 shadow-2xl
                                animate-in slide-in-from-bottom duration-300
                                sm:rounded-3xl sm:border-2 sm:border-b-8
                                sm:p-8 sm:animate-in sm:zoom-in-95
                            "
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.primary,
                            }}
                        >
                            {/* Indicador mobile */}
                            <div
                                className="
                                    mx-auto h-1.5 w-12 rounded-full sm:hidden
                                "
                                style={{ backgroundColor: colors.border }}
                            />

                            {/* Fechar */}
                            <button
                                type="button"
                                onClick={() => setSelectedPowerUp(null)}
                                aria-label="Fechar"
                                className="
                                    absolute right-4 top-4 rounded-lg p-2
                                    transition-colors
                                "
                                style={{ color: colors.muted }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.backgroundColor = colors.surface;
                                    e.currentTarget.style.color = colors.text;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = colors.muted;
                                }}
                            >
                                <BsX className="h-6 w-6" />
                            </button>

                            {/* Ícone */}
                            <div
                                className="
                                    mx-auto flex h-14 w-14 items-center
                                    justify-center rounded-2xl border-2
                                    border-b-4 sm:h-16 sm:w-16
                                "
                                style={{
                                    backgroundColor: colors.surface,
                                    borderColor: colors.primary,
                                    color: colors.primary,
                                }}
                            >
                                <BsLightningFill className="h-7 w-7 sm:h-8 sm:w-8" />
                            </div>

                            {/* Informações */}
                            <div className="space-y-2 text-center">
                                <h3
                                    id="powerup-title"
                                    className="
                                        pr-6 text-lg font-black uppercase
                                        tracking-wide sm:pr-0 sm:text-xl
                                    "
                                    style={{ color: colors.text }}
                                >
                                    {selectedPowerUp.powerup_type}
                                </h3>

                                <p
                                    className="
                                        text-xs font-extrabold leading-relaxed
                                        sm:text-sm
                                    "
                                    style={{ color: colors.muted }}
                                >
                                    {selectedPowerUp.descricao ??
                                        selectedPowerUp.description ??
                                        "Use este poder especial para obter vantagens estratégicas nesta rodada!"}
                                </p>
                            </div>

                            {/* Seleção de jogador para SKIP */}
                            {selectedPowerUp.powerup_type === "SKIP_TURN" && players && (
                                <div className="space-y-3">
                                    <p
                                        className="
                                            text-center text-xs font-black
                                            uppercase tracking-wider
                                        "
                                        style={{ color: colors.primary }}
                                    >
                                        Escolha um jogador
                                    </p>

                                    <div className="
                                        flex max-h-52 flex-col gap-2
                                        overflow-y-auto pr-1
                                    ">
                                        {players.map((item: any) => (
                                            <button
                                                key={item?.player_id}
                                                type="button"
                                                onClick={() =>
                                                    onConfirmPowerUp(
                                                        selectedPowerUp.powerup_id,
                                                        item.player_id
                                                    )
                                                }
                                                className="
                                                    w-full rounded-xl border-2
                                                    border-b-4 p-3 text-left
                                                    text-sm font-black
                                                    transition-all
                                                    hover:brightness-110
                                                    active:translate-y-0.5
                                                    active:border-b-2
                                                "
                                                style={{
                                                    backgroundColor: colors.surface,
                                                    borderColor: colors.border,
                                                    color: colors.text,
                                                }}
                                            >
                                                {item.player_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Ativar outros poderes */}
                            {selectedPowerUp.powerup_type !== "SKIP_TURN" && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleConfirmPowerUpWithSound(
                                            selectedPowerUp.powerup_id
                                        )
                                    }
                                    className="
                                        flex w-full items-center
                                        justify-center gap-2 rounded-2xl
                                        border-b-4 py-3.5 text-sm
                                        font-black uppercase tracking-wider
                                        text-white shadow-sm transition-all
                                        hover:brightness-110
                                        active:translate-y-1 active:border-b-0
                                        sm:text-base
                                    "
                                    style={{
                                        backgroundColor: colors.success,
                                        borderColor: colors.success,
                                    }}
                                >
                                    <BsLightningFill className="h-5 w-5" />
                                    Usar Power-up
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </>
    );
};

export default RoomLivePage;
