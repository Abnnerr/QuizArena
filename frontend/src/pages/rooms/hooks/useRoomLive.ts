import { useNavigate, useParams } from "react-router";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { useEffect, useState } from "react";
import { AXIOS } from "../../../service";
import { socket } from "../../../service/socket";


const QUESTION_TIME = 20;

type Alternative = {
    id: number;
    text: string;
};

type Question = {
    id: number;
    text: string;
    alternatives: Alternative[];
};
const useRoomLive = () => {

    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();
    const { player } = usePlayer();
    const { user } = useAuth();

    const [position, setPosition] = useState(0);
    const [round, setRound] = useState<number | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [totalQuestion, setTotalQuestion] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter" || timeLeft > 0 || round === null) {
            return;
        }

        if (position >= totalQuestion) {
            navigate(`/${roomCode}/${round}/podio`)
            return
        }
        navigate(`/${roomCode}/${round}/ranking`);
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

        setTimeLeft(restante);
        setSelectedAnswer(null);
        setAnswered(false);
        setError(null);
    };


    const buscarRound = async () => {
        try {
            const savedPosition = sessionStorage.getItem("position");
            const currentPosition = savedPosition ? Number(JSON.parse(savedPosition)) : 1;

            setPosition(currentPosition);

            const { data } = await AXIOS.get(`/round/${roomCode}/findRound`);


            setTotalQuestion(data.data.count_questions)
            setPosition(data.data.position)
            const { data: dataPlayers } = await AXIOS.get(`/player/${roomCode}/podium`);

            sessionStorage.setItem("podium", JSON.stringify(dataPlayers));

            if (data.type !== "Success") {
                setQuestion(null);
                setError(data.message ?? "Não foi possível carregar a pergunta.");
                return;
            }

            const roundData = data.data;

            if (!roundData) {
                setQuestion(null);
                setError("Não há pergunta disponível nesta posição.");
                return;
            }

            atualizarPergunta(roundData);
        } catch (err) {
            console.error("Erro ao buscar a rodada:", err);
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

        const findRound = () => {
            void buscarRound();
        };
        const roomJoin = () => {
            socket.emit('room:join', roomCode)
        }
        const roomFinished = () => {
            navigate('/')
            sessionStorage.clear()
        }

        socket.on("connect", roomJoin)
        socket.on("question:started", findRound);
        socket.on("room:finished", roomFinished)


        if (!socket.connected) {
            socket.connect();
        } else {
            roomJoin();
        }

        void buscarRound();

        return () => {
            socket.off("connect", roomJoin);
            socket.off("question:started", findRound);
            socket.off("room:finished", roomFinished)
        };
    }, [roomCode]);

    useEffect(() => {
        if (!question || loading || timeLeft <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTimeLeft(previous => Math.max(0, previous - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [question, timeLeft, loading]);

    const handleAnswer = async (answerId: number) => {
        if (!question || answered || timeLeft <= 0 || round === null) {
            return;
        }

        setSelectedAnswer(answerId);
        setAnswered(true);

        try {
            const { data } = await AXIOS.post(`/answer/${roomCode}/createAnswer`, {
                playerId: player?.player_id,
                roundId: round,
                alternativeId: answerId,
            }
            );

            if (data.type !== "Success") {
                setError(data.message ?? "Não foi possível enviar a resposta.");
            }
        } catch (err) {
            console.error("Erro ao enviar resposta:", err);
            setError("Não foi possível enviar sua resposta.");
        }
    };

    const progress =
        (timeLeft / (question ? QUESTION_TIME : QUESTION_TIME)) * 100;

    const isCriticalTime = timeLeft <= 5;

    return {
        progress,
        isCriticalTime,
        handleAnswer,
        handleKeyDown,
        user,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
        answered
    }
}

export default useRoomLive;