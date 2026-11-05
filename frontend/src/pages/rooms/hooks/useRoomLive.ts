
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { useEffect, useState } from "react";
import { AXIOS } from "../../../service";
import { socket } from "../../../service/socket";
import { useNavigate, useParams } from "react-router";


const QUESTION_TIME = 20;


// type powerUp = {
//     powerup_id: number,
//     powerup_type: string,
//     descricao: string
// }
type Alternative = {
    id: number;
    text: string;
};

type Question = {
    id: number;
    text: string;
    alternatives: Alternative[];
};

interface PowerUpItem {
    powerup_id: number;
    powerup_type: string;
    descricao: string;
    used: boolean;
}

interface PowerFiftyPayload {
    playerId: string;
    alternatives: Array<{
        alternative_id: number;
        alternative_text?: string;
    }>;
}

const useRoomLive = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();

    const { player } = usePlayer();
    const { user } = useAuth();

    const isHost = Boolean(user);

    const [players, setPlayers] = useState([])
    const [skip, setSkip] = useState<boolean>(false)
    const [selectedPowerUp, setSelectedPowerUp] = useState<any | null>(null);
    const [position, setPosition] = useState(0);
    const [round, setRound] = useState<number | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
    const [questionTime, setQuestionTime] = useState(QUESTION_TIME);

    const [powerUp, setPowerUp] = useState<PowerUpItem[]>([]);
    const [hiddenAlternativeIds, setHiddenAlternativeIds] = useState<number[]>([]);

    const [totalQuestion, setTotalQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answered, setAnswered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [usingPowerUp, setUsingPowerUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Identifica o jogador, inclusive quando a página é recarregada.
    const getPlayerId = () => {
        if (player?.player_id) {
            return player.player_id;
        }

        const storedPlayer = sessionStorage.getItem("player");

        if (!storedPlayer) return undefined;

        try {
            return JSON.parse(storedPlayer).player_id as string;
        } catch {
            return undefined;
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key !== "Enter" || timeLeft > 0 || round === null || !isHost) {
            return;
        }

        if (position >= totalQuestion) {
            navigate(`/${roomCode}/${round}/podio`);
            return;
        }

        navigate(`/${roomCode}/${round}/ranking`);
    };

    // Atualiza a pergunta recebida do backend
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

        setSkip(data.skip)
        setRound(data.round_id);


        const duration = Number(data.time_limit ?? QUESTION_TIME);
        const start = new Date(data.round_opened).getTime();
        const serverNow = new Date(data.server_now).getTime();

        const elapsed = Math.max(
            0,
            Math.floor((serverNow - start) / 1000)
        );
        const remaining = Math.max(0, duration - elapsed);


        console.log({
            round_opened: data.round_opened,
            parsedDate: new Date(data.round_opened).toString(),
            now: new Date().toString(),
            difference: (Date.now() - new Date(data.round_opened).getTime()) / 1000,
            time_limit: data.time_limit
        });
        setQuestionTime(duration);
        setTimeLeft(remaining);

        setSelectedAnswer(null);
        setAnswered(false);
        setHiddenAlternativeIds([]);
        setError(null);
    };

    // Busca a rodada atual.
    const buscarRound = async () => {
        try {
            const playerId = getPlayerId();

            const url = playerId
                ? `/round/${roomCode}/${playerId}/findRound`
                : `/round/${roomCode}/findRound`;

            const { data } = await AXIOS.get(url);

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

            setPowerUp(roundData.powers ?? []);
            setTotalQuestion(roundData.count_questions ?? 0);
            setPosition(roundData.position ?? 0);

            const { data: dataPlayers } = await AXIOS.get(
                `/player/${roomCode}/podium`
            );

            const plays = dataPlayers.data.map((item: any) => item.players).filter((item: any) => item.player_id !== player?.player_id)
            console.log(plays);

            setPlayers(plays)


            sessionStorage.setItem("podium", JSON.stringify(dataPlayers));

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

        const roomJoin = () => {
            socket.emit("room:join", roomCode);
        };

        const findRound = () => {
            void buscarRound();
        };

        const roomFinished = () => {
            navigate("/");
            sessionStorage.clear();
        };

        // Recebe o evento do power-up 50/50.
        const handlePowerFifty = (data: PowerFiftyPayload) => {
            const currentPlayerId = getPlayerId();

            // console.log(data, currentPlayerId);

            // Só aplica o efeito ao jogador que ativou o power-up.
            if (data.playerId !== currentPlayerId) {
                return;
            }

            const ids = data.alternatives.map(
                alternative => alternative.alternative_id
            );

            setHiddenAlternativeIds(ids);
        };

        const skiped = (data: any) => {

            if (data.target === player?.player_id) {
                setSkip(data.skiped)
                return
            }
            return
        }
        socket.on("connect", roomJoin);
        socket.on("question:started", findRound);
        socket.on("room:finished", roomFinished);
        socket.on("room:powerfifty", handlePowerFifty);
        socket.on("room:skip", skiped);

        if (!socket.connected) {
            socket.connect();
        } else {
            roomJoin();
        }

        void buscarRound();

        return () => {
            socket.off("connect", roomJoin);
            socket.off("question:started", findRound);
            socket.off("room:finished", roomFinished);
            socket.off("room:powerfifty", handlePowerFifty);
            socket.off("room:skip", skiped);
        };
    }, [roomCode, player?.player_id]);

    // Contagem regressiva.
    useEffect(() => {
        if (!question || loading || timeLeft <= 0) {
            return;
        }

        const timer = window.setTimeout(() => {
            setTimeLeft(previous => Math.max(0, previous - 1));
        }, 1000);

        return () => window.clearTimeout(timer);
    }, [question, timeLeft, loading]);

    // Envia resposta.
    const handleAnswer = async (answerId: number) => {
        if (!question || answered || skip || timeLeft <= 0 || round === null) {
            return;
        }

        setSelectedAnswer(answerId);
        setAnswered(true);

        try {
            const { data } = await AXIOS.post(
                `/answer/${roomCode}/createAnswer`,
                {
                    playerId: getPlayerId(),
                    roundId: round,
                    alternativeId: answerId,
                }
            );

            if (data.type !== "Success") {
                setError(data.message ?? "Não foi possível enviar a resposta.");
                setAnswered(false);
                setSelectedAnswer(null);
            }
        } catch (err) {
            console.error("Erro ao enviar resposta:", err);
            setError("Não foi possível enviar sua resposta.");
            setAnswered(false);
            setSelectedAnswer(null);
        }
    };

    // Ativa power-up.
    const handleUsePowerUp = async (powerupId: number, targetPlayer?: string) => {
        if (usingPowerUp || !getPlayerId()) return;

        try {
            setUsingPowerUp(true);

            const { data } = await AXIOS.post(
                `/player/${roomCode}/${getPlayerId()}/${powerupId}/powerup`,
                targetPlayer ? { target: targetPlayer } : undefined
            );

            if (data.type !== "Success") {
                setError(data.message ?? "Não foi possível utilizar o power-up.");
                return;
            }

            setSelectedPowerUp(null);

            // Atualiza apenas o power-up utilizado.
            setPowerUp((previous) =>
                previous.map((power) =>
                    power.powerup_id === powerupId
                        ? { ...power, used: true }
                        : power
                )
            );

        } catch (err) {
            console.error("Erro ao utilizar power-up:", err);
            setError("Não foi possível utilizar o power-up.");
        } finally {
            setUsingPowerUp(false);
        }
    };


    const onConfirmPowerUp = (powerupId: number, playerId?: string) => {
        if (handleUsePowerUp) {
            handleUsePowerUp(powerupId, playerId);
        }
        setSelectedPowerUp(null);
    };
    const progress = (timeLeft / questionTime) * 100;
    const isCriticalTime = timeLeft <= 5;

    return {
        progress,
        isCriticalTime,
        handleAnswer,
        handleKeyDown,
        handleUsePowerUp,
        onConfirmPowerUp,
        setSelectedPowerUp,
        selectedPowerUp,

        user,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
        answered,

        powerUp,
        hiddenAlternativeIds,
        usingPowerUp,
        skip,
        isHost,
        players
    };
};

export default useRoomLive;