import { Helmet } from "react-helmet-async";
import {
    BsTriangleFill,
    BsSquareFill,
    BsCircleFill,
    BsDiamondFill,
    BsClockHistory,
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
        user,
        progress,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
        answered,
    } = useRoomLive();

    const isHost = Boolean(user);

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <main
                onKeyDown={handleKeyDown}
                tabIndex={0}
                className="min-h-screen bg-[#FFFFFF] text-[#4B4B4B] font-['Nunito',sans-serif] flex flex-col relative overflow-x-hidden select-none outline-none"
            >
                {/* Background Dot Pattern */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-25 z-0"
                    style={{
                        backgroundImage:
                            "radial-gradient(#E5E5E5 2px, transparent 2px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* Barra Superior de Progresso do Tempo */}
                <div className="h-3 w-full bg-[#E5E5E5] relative overflow-hidden z-20">
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

                <section className="flex-1 w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10 gap-6 my-auto">
                    {/* Timer Regressivo */}
                    <div className="flex items-center justify-center">
                        <div
                            className={`px-5 py-2.5 rounded-2xl border-2 border-b-4 flex items-center gap-2 font-black transition-all shadow-sm ${isCriticalTime
                                    ? "border-[#FF4B4B] bg-[#FFD2D2] text-[#A80000] animate-bounce"
                                    : "border-[#FFC800] bg-[#FFFBF0] text-[#7A5B00]"
                                }`}
                        >
                            <BsClockHistory className="w-5 h-5" />
                            <span className="text-2xl sm:text-3xl font-black leading-none">
                                {timeLeft}s
                            </span>
                        </div>
                    </div>

                    {/* Card do Enunciado - Exibido EXCLUSIVAMENTE para o Host */}
                    {isHost && (
                        <div className="flex-1 min-h-[160px] sm:min-h-[200px] flex items-center justify-center text-center bg-white border-2 border-[#E5E5E5] border-b-8 rounded-3xl p-6 sm:p-10 shadow-sm relative">
                            <div className="relative z-10">
                                {loading ? (
                                    <div className="space-y-3">
                                        <div className="inline-block w-8 h-8 border-4 border-[#1CB0F6] border-t-transparent rounded-full animate-spin" />
                                        <p className="text-[#AFAFAF] text-lg font-black uppercase tracking-wider">
                                            Carregando partida...
                                        </p>
                                    </div>
                                ) : error ? (
                                    <p className="text-[#FF4B4B] text-xl font-black">
                                        {error}
                                    </p>
                                ) : question ? (
                                    <h1 className="text-[#4B4B4B] text-xl sm:text-3xl lg:text-4xl font-black leading-snug tracking-tight">
                                        {question.text}
                                    </h1>
                                ) : (
                                    <p className="text-[#AFAFAF] text-xl font-black uppercase tracking-wider">
                                        Aguardando a próxima pergunta...
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Grid de Alternativas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 my-auto">
                        {question?.alternatives.map((alternative, index) => {
                            const style =
                                ALTERNATIVE_STYLES[
                                index % ALTERNATIVE_STYLES.length
                                ];

                            const IconComponent = style.icon;
                            const isSelected = selectedAnswer === alternative.id;

                            return (
                                <button
                                    key={alternative.id}
                                    type="button"
                                    /* Host desativado; Jogadores podem clicar livremente */
                                    disabled={
                                        isHost ||
                                        loading ||
                                        answered ||
                                        timeLeft <= 0
                                    }
                                    onClick={() =>
                                        handleAnswer(alternative.id)
                                    }
                                    className={`min-h-[88px] sm:min-h-[110px] rounded-2xl p-4 sm:p-5 flex items-center justify-center font-black text-base sm:text-lg transition-all duration-75 ${style.color
                                        } ${isSelected
                                            ? "translate-y-1 border-b-0 ring-4 ring-[#1CB0F6]/30"
                                            : isHost
                                                ? "opacity-90 cursor-default"
                                                : "active:border-b-0 active:translate-y-1 cursor-pointer"
                                        } ${answered && !isSelected
                                            ? "opacity-40 grayscale-[30%]"
                                            : ""
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div
                                        className={`flex items-center gap-3 sm:gap-4 min-w-0 w-full ${isHost ? "justify-start" : "justify-center"
                                            }`}
                                    >
                                        {/* Ícone da Forma Geométrica */}
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 rounded-xl bg-white/20 border-b-2 border-black/10 flex items-center justify-center">
                                            <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                                        </div>

                                        {/* Texto da alternativa exclusivo do Host */}
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
            </main>
        </>
    );
};

export default RoomLivePage;