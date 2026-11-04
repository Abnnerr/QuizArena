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
} from "react-icons/bs";
import useRoomLive from "../hooks/useRoomLive";

const ALTERNATIVE_STYLES = [
    {
        color: "bg-[#E21B3C] hover:bg-[#c41532] text-white border-2 border-b-4 border-[#9E1328]",
        icon: BsTriangleFill,
    },
    {
        color: "bg-[#1368CE] hover:bg-[#0f53a8] text-white border-2 border-b-4 border-[#0B3E7A]",
        icon: BsDiamondFill,
    },
    {
        color: "bg-[#D89E00] hover:bg-[#b08100] text-white border-2 border-b-4 border-[#805E00]",
        icon: BsCircleFill,
    },
    {
        color: "bg-[#26890C] hover:bg-[#1f6e0a] text-white border-2 border-b-4 border-[#174F07]",
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
        players
    } = useRoomLive();


    return (
        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className={`w-full min-h-[100dvh] bg-[#121212] text-[#F3F4F6] font-['Nunito',sans-serif] flex flex-col justify-between relative overflow-x-hidden select-none outline-none transition-all duration-300 ${skip
                    ? "ring-4 sm:ring-8 ring-inset ring-[#1CB0F6] shadow-[inset_0_0_50px_rgba(28,176,246,0.3)]"
                    : ""
                    }`}
            >
                {/* Overlay de Efeito SKIP (Setas animadas descendo) */}
                {skip && (
                    <div className="fixed inset-0 pointer-events-none z-40 flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden duration-600">
                        <div className="absolute inset-x-4 top-1/4 flex justify-between opacity-30 text-[#1CB0F6]">
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s]" />
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:200ms]" />
                        </div>
                        <div className="absolute inset-x-16 top-1/2 flex justify-between opacity-30 text-[#1CB0F6]">
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:400ms]" />
                            <BsChevronDown className="w-8 h-8 sm:w-12 sm:h-12 animate-bounce [animation-duration:1.2s] [animation-delay:600ms]" />
                        </div>

                        <div className="flex flex-col items-center gap-1 text-[#1CB0F6] animate-pulse mb-4 bg-[#1E1E1E]/90 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-2xl border-2 border-[#1CB0F6] border-b-4 shadow-lg pointer-events-auto">
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

                {/* Background Dot Pattern Ajustado para Dark Mode */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-15 z-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(#383838 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Barra Superior de Progresso */}
                <div className="h-2.5 sm:h-3 w-full bg-[#2A2A2A] relative overflow-hidden z-20 shrink-0">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${isCriticalTime
                            ? "bg-[#FF4B4B] animate-pulse"
                            : "bg-[#FFC800]"
                            }`}
                        style={{
                            width: `${Math.max(0, progress)}%`,
                        }}
                    />
                </div>

                <section className="flex-1 w-full max-w-4xl mx-auto p-3 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10 gap-3 sm:gap-6 my-auto">
                    {/* Cabeçalho Fixo: Power-ups em cima (sem scroll) e Timer embaixo */}
                    <div className="flex flex-col gap-2 w-full shrink-0">

                        {/* 1. Três Power-ups em cima dividindo o espaço perfeitamente */}
                        <div className="grid grid-cols-3 gap-2 w-full">
                            {powerUp && powerUp.slice(0, 3).map((item: any, idx: number) => (
                                <button
                                    key={item.powerup_id ?? idx}
                                    disabled={item.used === true}
                                    type="button"
                                    onClick={() => setSelectedPowerUp(item)}
                                    className={`py-2 px-1.5 sm:px-3.5 rounded-2xl flex items-center justify-center gap-1.5 font-black text-[11px] sm:text-sm transition-all shadow-sm border-2 border-b-4 truncate ${item.used
                                            ? "bg-[#1E1E1E] border-[#333333] text-[#666666] cursor-not-allowed opacity-50"
                                            : "bg-[#1E1E1E] hover:bg-[#282828] border-[#FFC800]/60 border-b-[#FFC800] text-[#FFC800] cursor-pointer active:border-b-2 active:translate-y-0.5"
                                        }`}
                                >
                                    <BsLightningFill className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${item.used ? "text-[#666666]" : "text-[#FFC800]"}`} />
                                    <span className="capitalize truncate">{item.powerup_type}</span>
                                </button>
                            ))}
                        </div>

                        {/* 2. Timer na parte de baixo ocupando toda a largura */}
                        <div
                            className={`w-full py-2.5 sm:py-2 rounded-2xl border-2 border-b-4 flex items-center justify-center gap-2 font-black transition-all shadow-sm shrink-0 ${isCriticalTime
                                    ? "border-[#FF4B4B] bg-[#3B1515] text-[#FF6B6B] animate-bounce"
                                    : "border-[#FFC800]/60 bg-[#1E1E1E] text-[#FFC800]"
                                }`}
                        >
                            <BsClockHistory className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                            <span className="text-base sm:text-2xl font-black leading-none">
                                {timeLeft}s restantes
                            </span>
                        </div>
                    </div>
                    {/* Enunciado do Host */}
                    {isHost && (
                        <div className="flex-1 min-h-[120px] sm:min-h-[180px] max-h-[220px] sm:max-h-none flex items-center justify-center text-center bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-4 sm:border-b-8 rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-lg relative overflow-y-auto">
                            <div className="relative z-10 w-full">
                                {loading ? (
                                    <div className="space-y-2 sm:space-y-3">
                                        <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[#888888] text-xs sm:text-lg font-black uppercase tracking-wider">
                                            Carregando partida...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <p className="text-[#FF4B4B] text-base sm:text-xl font-black">
                                        {error}
                                    </p>
                                ) : question ? (
                                    <h1 className="text-[#F3F4F6] text-base sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight break-words">
                                        {question.text}
                                    </h1>
                                ) : (
                                    <p className="text-[#888888] text-sm sm:text-xl font-black uppercase tracking-wider">
                                        Aguardando a próxima pergunta...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Alternativas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 my-auto shrink-0">
                        {question?.alternatives.map((alternative: any, index: number) => {
                            const style =
                                ALTERNATIVE_STYLES[
                                index % ALTERNATIVE_STYLES.length
                                ];

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
                                    className={`min-h-[64px] sm:min-h-[110px] rounded-xl sm:rounded-2xl p-3 sm:p-5 flex items-center justify-center font-black text-xs sm:text-lg transition-all duration-75 ${style.color
                                        } ${isSelected || skip
                                            ? "translate-y-1 border-b-0 ring-4 ring-[#1CB0F6]/50"
                                            : isHost
                                                ? "opacity-90 cursor-default"
                                                : "active:border-b-0 active:translate-y-1 cursor-pointer"
                                        } ${isEliminated
                                            ? "opacity-30 grayscale cursor-not-allowed"
                                            : ""
                                        } ${answered && !isSelected
                                            ? "opacity-30 grayscale-[50%]"
                                            : ""
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div
                                        className={`flex items-center gap-2.5 sm:gap-4 min-w-0 w-full ${isHost ? "justify-start" : "justify-center"
                                            }`}
                                    >
                                        <div className="w-9 h-9 sm:w-14 sm:h-14 shrink-0 rounded-lg sm:rounded-xl bg-black/20 border-b-2 border-black/30 flex items-center justify-center">
                                            <IconComponent className="w-4 h-4 sm:w-8 sm:h-8 text-white" />
                                        </div>

                                        {isHost && (
                                            <span className="truncate text-left text-white tracking-wide text-xs sm:text-base">
                                                {alternative.text}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* VISUALIZAÇÃO RESPONSIVA DE POWER-UP (DARK THEME) */}
                {selectedPowerUp && (
                    <>
                        {/* 1. MODAL CENTRALIZADO (DESKTOP - SM+) */}
                        <div className="hidden sm:flex fixed inset-0 bg-black/75 z-50 items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                            {/* Backdrop para fechar */}
                            <div className="absolute inset-0" onClick={() => setSelectedPowerUp(null)} />

                            <div className="bg-[#1E1E1E] border-2 border-[#2A2A2A] border-b-8 rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-5 text-center relative z-10">
                                <button
                                    onClick={() => setSelectedPowerUp(null)}
                                    className="absolute right-4 top-4 text-[#888888] hover:text-[#FFFFFF] p-1 cursor-pointer transition-colors"
                                >
                                    <BsX className="w-6 h-6" />
                                </button>

                                <div className="w-16 h-16 bg-[#282828] border-2 border-[#FFC800]/60 border-b-4 rounded-2xl mx-auto flex items-center justify-center text-[#FFC800] shadow-sm">
                                    <BsLightningFill className="w-8 h-8" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-[#F3F4F6] uppercase tracking-wide">
                                        {selectedPowerUp.powerup_type}
                                    </h3>
                                    <p className="text-sm font-extrabold text-[#AAAAAA] leading-relaxed">
                                        {selectedPowerUp.descricao ?? selectedPowerUp.description ?? "Use este poder especial para obter vantagens estratégicas nesta rodada!"}
                                    </p>

                                    {selectedPowerUp.powerup_type === 'SKIP_TURN' && players && (
                                        <div className="flex flex-col gap-2 pt-2 max-h-48 overflow-y-auto">
                                            {players.map((item: any) => (
                                                <button
                                                    key={item?.player_id}
                                                    type="button"
                                                    onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id, item.player_id)}
                                                    className="w-full bg-[#282828] hover:bg-[#333333] border-2 border-[#3A3A3A] border-b-4 text-[#F3F4F6] font-black p-2.5 rounded-xl text-sm transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer"
                                                >
                                                    {item.player_name}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedPowerUp.powerup_type !== 'SKIP_TURN' && (
                                    <button
                                        type="button"
                                        onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id)}
                                        className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-3.5 rounded-2xl text-base uppercase tracking-wider cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
                                    >
                                        <BsLightningFill className="w-5 h-5" />
                                        <span>Usar Power-up</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* 2. MINI-ABA INFERIOR / BOTTOM SHEET (MOBILE) */}
                        <div className="flex sm:hidden fixed inset-0 bg-black/75 z-50 flex-col justify-end backdrop-blur-sm animate-in fade-in duration-200">
                            <div className="flex-1" onClick={() => setSelectedPowerUp(null)} />

                            <div className="bg-[#1E1E1E] border-t-4 border-[#2A2A2A] rounded-t-3xl p-5 w-full shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-300 relative z-10 max-h-[80dvh] overflow-y-auto">
                                <div className="w-10 h-1.5 bg-[#333333] rounded-full mx-auto mb-1" />

                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-[#282828] border-2 border-[#FFC800]/60 border-b-4 rounded-xl flex items-center justify-center text-[#FFC800] shrink-0">
                                            <BsLightningFill className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-black text-[#F3F4F6] uppercase tracking-wide">
                                                {selectedPowerUp.powerup_type}
                                            </h3>
                                            <p className="text-xs font-extrabold text-[#AAAAAA] mt-0.5">
                                                {selectedPowerUp.descricao ?? selectedPowerUp.description ?? "Ative para ganhar vantagem na rodada atual!"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setSelectedPowerUp(null)}
                                        className="text-[#888888] hover:text-[#FFFFFF] p-1 cursor-pointer shrink-0"
                                    >
                                        <BsX className="w-6 h-6" />
                                    </button>
                                </div>

                                {selectedPowerUp.powerup_type === 'SKIP_TURN' && players && (
                                    <div className="flex flex-col gap-2 pt-1 max-h-40 overflow-y-auto">
                                        {players.map((item: any) => (
                                            <button
                                                key={item?.player_id}
                                                type="button"
                                                onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id, item.player_id)}
                                                className="w-full bg-[#282828] active:bg-[#333333] border-2 border-[#3A3A3A] border-b-4 text-[#F3F4F6] font-black p-2.5 rounded-xl text-xs"
                                            >
                                                {item.player_name}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {selectedPowerUp.powerup_type !== 'SKIP_TURN' && (
                                    <div className="pt-1">
                                        <button
                                            type="button"
                                            onClick={() => onConfirmPowerUp(selectedPowerUp.powerup_id)}
                                            className="w-full bg-[#58CC02] hover:bg-[#61E002] border-b-4 border-[#46A302] active:border-b-0 active:translate-y-1 text-white font-black py-3 rounded-xl text-sm uppercase tracking-wider cursor-pointer transition-all shadow-sm flex items-center justify-center gap-2"
                                        >
                                            <BsLightningFill className="w-4 h-4" />
                                            <span>Ativar Poder Agora</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    );
};

export default RoomLivePage;