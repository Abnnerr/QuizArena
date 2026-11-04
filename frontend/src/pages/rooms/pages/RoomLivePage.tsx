import { useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
    BsChevronDown,
    BsClockHistory,
    BsLightningFill,
    BsX
} from "react-icons/bs";

export const LiveRoomPage = ({
    handleKeyDown,
    skip,
    isCriticalTime,
    progress,
    powerUp,
    setSelectedPowerUp,
    timeLeft,
    isHost,
    loading,
    error,
    question,
    selectedAnswer,
    hiddenAlternativeIds,
    answered,
    handleAnswer,
    selectedPowerUp,
    players,
    onConfirmPowerUp,
    ALTERNATIVE_STYLES
}: any) => {

    // Fecha os modais ao pressionar a tecla ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSelectedPowerUp(null);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setSelectedPowerUp]);

    // Conteúdo reutilizável para o modal de Power-up (Desktop & Mobile)
    const renderPowerUpContent = useCallback(() => {
        if (!selectedPowerUp) return null;

        const isSkipTurn = selectedPowerUp.powerup_type === 'SKIP_TURN';
        const description = selectedPowerUp.descricao ??
            selectedPowerUp.description ??
            "Use este poder especial para obter vantagens estratégicas nesta rodada!";

        return (
            <div className="space-y-4 w-full">
                <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-black text-[#F3F4F6] uppercase tracking-wide">
                        {selectedPowerUp.powerup_type}
                    </h3>
                    <p className="text-xs sm:text-sm font-extrabold text-[#AAAAAA] leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Seleção de Alvo (SKIP_TURN) */}
                {isSkipTurn && players && (
                    <div className="flex flex-col gap-2 pt-2 max-h-44 sm:max-h-56 overflow-y-auto pr-1">
                        {players.map((item: any) => (
                            <button
                                key={item?.player_id}
                                type="button"
                                onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id, item.player_id)}
                                className="w-full bg-[#282828] hover:bg-[#333333] active:bg-[#383838] border-2 border-[#3A3A3A] border-b-4 text-[#F3F4F6] font-black p-3 rounded-xl text-xs sm:text-sm transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer flex items-center justify-between"
                            >
                                <span className="truncate pr-2">{item.player_name}</span>
                                <BsLightningFill className="w-4 h-4 text-[#FFC800] shrink-0" />
                            </button>
                        ))}
                    </div>
                )}

                {/* Ativação Direta (Outros Poderes) */}
                {!isSkipTurn && (
                    <div className="pt-2">
                        <button
                            type="button"
                            onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id)}
                            className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-3.5 rounded-2xl text-xs sm:text-base uppercase tracking-wider cursor-pointer transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <BsLightningFill className="w-5 h-5" />
                            <span>Ativar Poder Agora</span>
                        </button>
                    </div>
                )}
            </div>
        );
    }, [selectedPowerUp, players, onConfirmPowerUp]);

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`min-h-screen bg-[#121212] text-[#F3F4F6] font-['Nunito',sans-serif] flex flex-col relative overflow-x-hidden select-none outline-none transition-all duration-300 ${skip ? "ring-8 ring-inset ring-[#1CB0F6] shadow-[inset_0_0_50px_rgba(28,176,246,0.3)]" : ""
                    }`}
            >
                {/* Overlay de Efeito SKIP */}
                {skip && (
                    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden">
                        <div className="absolute inset-x-4 top-1/4 flex justify-between opacity-30 text-[#1CB0F6]">
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s]" />
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:200ms]" />
                        </div>
                        <div className="absolute inset-x-16 top-1/2 flex justify-between opacity-30 text-[#1CB0F6]">
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:400ms]" />
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:600ms]" />
                        </div>

                        <div className="flex flex-col items-center gap-1 text-[#1CB0F6] animate-pulse mb-4 bg-[#1E1E1E]/90 backdrop-blur-md px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl border-2 border-[#1CB0F6] border-b-4 shadow-lg pointer-events-auto">
                            <span className="font-black text-xs sm:text-sm uppercase tracking-wider text-white">
                                Sua vez foi pulada!
                            </span>
                            <div className="flex gap-2">
                                <BsChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce [animation-delay:0ms]" />
                                <BsChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce [animation-delay:250ms]" />
                                <BsChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce [animation-delay:500ms]" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Grid de Fundo em Pontos */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage: "radial-gradient(#383838 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Barra de Progresso Superior */}
                <div className="h-2.5 sm:h-3 w-full bg-[#2A2A2A] relative overflow-hidden z-20">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${isCriticalTime ? "bg-[#FF4B4B] animate-pulse" : "bg-[#FFC800]"
                            }`}
                        style={{ width: `${Math.max(0, progress)}%` }}
                    />
                </div>

                {/* Container Conteúdo Principal */}
                <section className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10 gap-4 sm:gap-6 my-auto">

                    {/* Cabeçalho: Power-ups e Timer */}
                    <div className="flex items-center justify-between w-full gap-2 sm:gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-[70%] sm:max-w-none no-scrollbar">
                            {powerUp && powerUp.map((item: any, idx: number) => (
                                <button
                                    key={item.powerup_id ?? idx}
                                    disabled={item.used === true}
                                    type="button"
                                    onClick={() => setSelectedPowerUp(item)}
                                    className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-2xl flex items-center gap-1.5 sm:gap-2 font-black text-xs sm:text-sm transition-all shadow-sm border-2 border-b-4 shrink-0 ${item.used
                                            ? "bg-[#1E1E1E] border-[#333333] text-[#666666] cursor-not-allowed opacity-50"
                                            : "bg-[#1E1E1E] hover:bg-[#282828] border-[#FFC800]/60 border-b-[#FFC800] text-[#FFC800] cursor-pointer active:border-b-2 active:translate-y-0.5"
                                        }`}
                                >
                                    <BsLightningFill className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${item.used ? "text-[#666666]" : "text-[#FFC800]"}`} />
                                    <span className="capitalize whitespace-nowrap">{item.powerup_type}</span>
                                </button>
                            ))}
                        </div>

                        <div
                            className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border-2 border-b-4 flex items-center gap-1.5 sm:gap-2 font-black transition-all shadow-sm shrink-0 ${isCriticalTime
                                    ? "border-[#FF4B4B] bg-[#3B1515] text-[#FF6B6B] animate-bounce"
                                    : "border-[#FFC800]/60 bg-[#1E1E1E] text-[#FFC800]"
                                }`}
                        >
                            <BsClockHistory className="w-4 h-4 sm:w-5 sm:h-5" />
                            <span className="text-lg sm:text-2xl font-black leading-none">
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    {/* Enunciado do Host */}
                    {isHost && (
                        <div className="flex-1 min-h-[140px] sm:min-h-[200px] flex items-center justify-center text-center bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-4 sm:border-b-8 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-lg relative">
                            <div className="relative z-10 w-full">
                                {loading ? (
                                    <div className="space-y-3">
                                        <div className="inline-block w-7 h-7 sm:w-8 sm:h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[#888888] text-sm sm:text-lg font-black uppercase tracking-wider">
                                            Carregando partida...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <p className="text-[#FF4B4B] text-lg sm:text-xl font-black">
                                        {error}
                                    </p>
                                ) : question ? (
                                    <h1 className="text-[#F3F4F6] text-lg sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight break-words">
                                        {question.text}
                                    </h1>
                                ) : (
                                    <p className="text-[#888888] text-base sm:text-xl font-black uppercase tracking-wider">
                                        Aguardando a próxima pergunta...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Alternativas de Resposta */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 my-auto">
                        {question?.alternatives.map((alternative: any, index: number) => {
                            const style = ALTERNATIVE_STYLES[index % ALTERNATIVE_STYLES.length];
                            const IconComponent = style.icon;
                            const isSelected = selectedAnswer === alternative.id;
                            const isEliminated = hiddenAlternativeIds?.includes(alternative.id);

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
                                        isEliminated
                                    }
                                    onClick={() => handleAnswer(alternative.id)}
                                    className={`min-h-[72px] sm:min-h-[110px] rounded-2xl p-3 sm:p-5 flex items-center justify-center font-black text-sm sm:text-lg transition-all duration-75 ${style.color
                                        } ${isSelected || skip
                                            ? "translate-y-1 border-b-0 ring-4 ring-[#1CB0F6]/50"
                                            : isHost
                                                ? "opacity-90 cursor-default"
                                                : "active:border-b-0 active:translate-y-1 cursor-pointer"
                                        } ${isEliminated ? "opacity-30 grayscale cursor-not-allowed" : ""
                                        } ${answered && !isSelected ? "opacity-30 grayscale-[50%]" : ""
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div
                                        className={`flex items-center gap-3 sm:gap-4 min-w-0 w-full ${isHost ? "justify-start" : "justify-center"
                                            }`}
                                    >
                                        <div className="w-10 h-10 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-black/20 border-b-2 border-black/30 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 sm:w-8 sm:h-8 text-white" />
                                        </div>

                                        {isHost && (
                                            <span className="truncate text-left text-white tracking-wide">
                                                {alternative.text}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* MODAIS RESPONSIVOS DE POWER-UP */}
                {selectedPowerUp && (
                    <>
                        {/* 1. MODAL DESKTOP (SM+) */}
                        <div className="hidden sm:flex fixed inset-0 bg-black/75 z-50 items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="absolute inset-0" onClick={() => setSelectedPowerUp(null)} />

                            <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl space-y-4 text-center relative z-10">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPowerUp(null)}
                                    className="absolute right-4 top-4 text-[#888888] hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
                                >
                                    <BsX className="w-6 h-6" />
                                </button>

                                <div className="w-14 h-14 bg-[#282828] border-2 border-[#FFC800]/60 border-b-4 rounded-2xl mx-auto flex items-center justify-center text-[#FFC800] shadow-sm">
                                    <BsLightningFill className="w-7 h-7" />
                                </div>

                                {renderPowerUpContent()}
                            </div>
                        </div>

                        {/* 2. BOTTOM SHEET MOBILE (< SM) */}
                        <div className="flex sm:hidden fixed inset-0 bg-black/75 z-50 flex-col justify-end backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="flex-1" onClick={() => setSelectedPowerUp(null)} />

                            <div className="bg-[#1E1E1E] border-t-4 border-[#2A2A2A] rounded-t-3xl p-5 w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 relative z-10 max-h-[85vh] overflow-y-auto">
                                <div className="w-10 h-1.5 bg-[#333333] rounded-full mx-auto mb-1" />

                                <div className="flex items-start justify-between gap-4">
                                    <div className="w-10 h-10 bg-[#282828] border-2 border-[#FFC800]/60 border-b-4 rounded-xl flex items-center justify-center text-[#FFC800] shrink-0">
                                        <BsLightningFill className="w-5 h-5" />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedPowerUp(null)}
                                        className="text-[#888888] hover:text-[#FFFFFF] p-1 cursor-pointer shrink-0"
                                    >
                                        <BsX className="w-6 h-6" />
                                    </button>
                                </div>

                                {renderPowerUpContent()}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default LiveRoomPage;