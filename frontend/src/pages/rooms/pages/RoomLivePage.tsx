import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import {
    BsTriangleFill,
    BsSquareFill,
    BsCircleFill,
    BsDiamondFill,
    BsDoorOpenFill,
    BsClockHistory,
    BsCheckLg
} from "react-icons/bs";

const QUESTION_TIME = 20;

const mockQuestion = {
    text: "Qual é a linguagem utilizada para estilizar páginas web?",
    alternatives: [
        { id: 1, text: "HTML", color: "bg-[#E21B3C] hover:bg-[#c41532] shadow-[0_6px_0_0_#9E1328]", icon: BsTriangleFill },
        { id: 2, text: "CSS", color: "bg-[#1368CE] hover:bg-[#0f53a8] shadow-[0_6px_0_0_#0B3E7A]", icon: BsDiamondFill },
        { id: 3, text: "JavaScript", color: "bg-[#D89E00] hover:bg-[#b08100] shadow-[0_6px_0_0_#805E00]", icon: BsCircleFill },
        { id: 4, text: "Python", color: "bg-[#26890C] hover:bg-[#1f6e0a] shadow-[0_6px_0_0_#174F07]", icon: BsSquareFill },
    ],
};

const RoomLivePage = () => {
    const navigate = useNavigate();
    const { roomCode } = useParams<{ roomCode: string }>();

    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0 || answered) return;

        const timer = window.setTimeout(() => {
            setTimeLeft((previous) => previous - 1);
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [timeLeft, answered]);

    const handleAnswer = (answerId: number) => {
        if (answered || timeLeft <= 0) return;

        setSelectedAnswer(answerId);
        setAnswered(true);

        // TODO: enviar a resposta ao backend.
        // socket.emit("answer:submit", { roomCode, answerId });
    };

    const progress = (timeLeft / QUESTION_TIME) * 100;
    const isCriticalTime = timeLeft <= 5;

    return (
        <>
            <Helmet>
                <title>QuizArena • Partida ao Vivo</title>
            </Helmet>

            <main className="min-h-screen bg-[#13092E] text-white font-['Nunito',sans-serif] flex flex-col relative overflow-hidden select-none">
                {/* Glows de fundo da arena */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#E21B3C]/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1368CE]/15 rounded-full blur-3xl pointer-events-none" />

                {/* Barra Superior */}
                <header className="flex items-center justify-center gap-100 px-7 py-4 border-b border-white/10 bg-[#1E1145]/60 backdrop-blur-md relative z-10">
                    <div className="text-2xl font-black tracking-tight flex items-center gap-1.5 drop-shadow-md">
                        <span className="bg-[#E21B3C] px-2.5 py-0.5 rounded-xl -rotate-2 text-sm shadow-[0_3px_0_0_#A0132B]">
                            Quiz
                        </span>
                        <span className="bg-[#1368CE] px-2.5 py-0.5 rounded-xl rotate-2 text-sm shadow-[0_3px_0_0_#0E4B94]">
                            Arena
                        </span>
                    </div>
                </header>

                {/* Barra de Progresso do Tempo */}
                <div className="h-2.5 w-full bg-black/40 relative overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${isCriticalTime ? "bg-[#E21B3C] animate-pulse" : "bg-[#D89E00]"
                            }`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Área Principal do Jogo */}
                <section className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col justify-between relative z-10 gap-6">

                    {/* Header da Rodada & Timer */}
                    <div className="flex items-center gap-4 justify-center">
                        <div
                            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-4 flex flex-col items-center justify-center font-black transition-all shadow-lg ${isCriticalTime
                                    ? "border-[#E21B3C] bg-[#E21B3C]/20 text-[#E21B3C] animate-bounce"
                                    : "border-[#D89E00] bg-[#D89E00]/10 text-[#D89E00]"
                                }`}
                        >
                            <span className="text-2xl sm:text-3xl leading-none">{timeLeft}</span>
                            <BsClockHistory className="w-3 h-3 opacity-70 mt-0.5" />
                        </div>
                    </div>

                    {
                    }
                    <div className="flex-1 min-h-[160px] sm:min-h-[220px] flex items-center justify-center text-center bg-white border-4 border-white/20 rounded-3xl p-6 sm:p-10 shadow-[0_15px_35px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-slate-100 pointer-events-none" />

                        <h1 className="text-[#13092E] text-xl sm:text-3xl lg:text-4xl font-black leading-snug relative z-10 drop-shadow-sm">
                            {mockQuestion.text}
                        </h1>
                    </div>

                    {/* Grid das Alternativas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {mockQuestion.alternatives.map((alternative) => {
                            const IconComponent = alternative.icon;
                            const isSelected = selectedAnswer === alternative.id;

                            return (
                                <button
                                    key={alternative.id}
                                    type="button"
                                    disabled={answered || timeLeft <= 0}
                                    onClick={() => handleAnswer(alternative.id)}
                                    className={`${alternative.color} text-white min-h-[72px] sm:min-h-[96px] rounded-2xl p-4 sm:p-5 flex items-center justify-between font-black text-base sm:text-xl transition-all active:translate-y-1 active:shadow-none cursor-pointer ${isSelected
                                            ? "  scale-[0.98] brightness-125"
                                            : ""
                                        } ${answered && !isSelected
                                            ? "opacity-40 grayscale-[20%]"
                                            : ""
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-black/20 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow" />
                                        </div>
                                        <span className="truncate text-left drop-shadow-md">
                                            {alternative.text}
                                        </span>
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