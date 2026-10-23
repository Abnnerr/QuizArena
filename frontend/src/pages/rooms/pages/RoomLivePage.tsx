import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router";
import {
    BsTriangleFill,
    BsSquareFill,
    BsCircleFill,
    BsDiamondFill,
    BsClockHistory,
} from "react-icons/bs";
import { socket } from "../../../service/socket";
import { AXIOS } from "../../../service";
import PodioPage from "./PodioPage";
import { usePlayer } from "../../../contexts/hooks/usePlayer";

const QUESTION_TIME = 20;

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

type Alternative = {
    id: number;
    text: string;
};

type Question = {
    id: number;
    text: string;
    alternatives: Alternative[];
};

const RoomLivePage = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate()
    const { player } = usePlayer()
    const [position, setPosition] = useState(1);
    const [round, setRound] = useState<any>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === "Enter" && timeLeft <= 0) {

            console.log(roomCode, round, position);

            socket.emit("round:finished", {
                roomCode,
                round_id: round,
                position
            })

            navigate(`/${roomCode}/podio`)
        }
    };

    const atualizarPergunta = (data: any) => {
        const questionData = data.questions ?? data;

        setQuestion({
            id: questionData.question_id ?? questionData.id,
            text: questionData.question_text ?? questionData.text,
            alternatives: questionData.alternatives.map(
                (alternative: any) => ({
                    id: alternative.alternative_id ?? alternative.id,
                    text: alternative.alternative_text ?? alternative.text,
                })
            ),
        });

        setRound(data.round_id);
        const inicio = new Date(data.round_opened).getTime();
        const decorrido = Math.floor((Date.now() - inicio) / 1000);
        const duracao = data.time_limit ?? QUESTION_TIME;

        const restante = Math.max(0, duracao - decorrido);

        setTimeLeft(restante ?? data.duration ?? QUESTION_TIME);

        setSelectedAnswer(null);
        setAnswered(false);
        setError(null);
        setLoading(false);
    };

    const buscarRound = async () => {
        try {
            const { data } = await AXIOS.get(`/room/${roomCode}/round`);
            const result = data;

            if (result.type !== "Success") {
                setQuestion(null);
                setError(
                    result.message ?? "Não foi possível carregar a pergunta."
                );
                return;
            }

            const roundData = result.data;

            if (!roundData) {
                setQuestion(null);
                setError(null);
                return;
            }

            atualizarPergunta(roundData);
        } catch (err) {
            console.error("Erro ao buscar o Round:", err);
            setError("Não foi possível carregar a partida.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!roomCode) {
            setError("Código da sala não encontrado.");
            setLoading(false);
            return;
        }

        const findRound = () => void buscarRound();

        socket.on("question:started", findRound);

        void buscarRound();

        return () => {
            socket.off("question:started", findRound);
        };
    }, [roomCode]);

    useEffect(() => {
        if (!question || loading) {
            return;
        }
        if (timeLeft <= 0) {
            setPosition(prev => prev + 1)
        }
        const timer = window.setTimeout(() => {
            setTimeLeft((previous) => Math.max(0, previous - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [question, timeLeft, answered, loading]);

    const handleAnswer = (answerId: number) => {
        if (!question || answered || timeLeft <= 0) return;

        setSelectedAnswer(answerId);
        setAnswered(true);

        socket.emit("answer:submit", {
            roomCode,
            playerId: player?.player_id,
            roundId: round,
            alternativeId: answerId,
        });
    };

    const progress = (timeLeft / QUESTION_TIME) * 100;
    const isCriticalTime = timeLeft <= 5;

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
                <div
                    className="absolute inset-0 pointer-events-none opacity-25 z-0"
                    style={{
                        backgroundImage: 'radial-gradient(#E5E5E5 2px, transparent 2px)',
                        backgroundSize: '24px 24px'
                    }}
                />

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

                    {/* Card do Enunciado */}
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

                    {/* Grid de Alternativas */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                                    disabled={
                                        loading ||
                                        answered ||
                                        timeLeft <= 0
                                    }
                                    onClick={() =>
                                        handleAnswer(alternative.id)
                                    }
                                    className={`min-h-[72px] sm:min-h-[88px] rounded-2xl p-4 sm:p-5 flex items-center justify-between font-black text-base sm:text-lg transition-all duration-75 cursor-pointer ${style.color
                                        } ${isSelected
                                            ? "translate-y-1 border-b-0 ring-4 ring-[#1CB0F6]/30"
                                            : "active:border-b-0 active:translate-y-1"
                                        } ${answered && !isSelected
                                            ? "opacity-40 grayscale-[30%]"
                                            : ""
                                        } disabled:cursor-not-allowed`}
                                >
                                    <div className="flex items-center gap-3 sm:gap-4 min-w-0 w-full">
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl bg-white/20 border-b-2 border-black/10 flex items-center justify-center">
                                            <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>

                                        <span className="truncate text-left text-white tracking-wide">
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