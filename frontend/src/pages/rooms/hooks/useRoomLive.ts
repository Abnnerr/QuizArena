
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useAuth } from "../../../contexts/hooks/useAuth";
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

interface AlternativeStatistics {
    alternativeId: number;
    isCorrect: boolean;
    count: number;
}

interface RankingPayload {
    roundId: number;
}

interface ExpiredPayload {
    roomCode: string;
    roundId: number;
}

const useRoomLive = () => {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();

    const { player } = usePlayer();
    const { user } = useAuth();

    const isHost = Boolean(user);

    const [playerNameUsed, setPlayerNameUsed] = useState<string | null>(null);
    const [alternativeStatistics, setAlternativeStatistics] = useState<AlternativeStatistics[]>([]);
    const [correctAlternative, setCorrectAlternative] = useState<number | null>(null);
    const [players, setPlayers] = useState<any[]>([]);
    const [skip, setSkip] = useState(false);
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

    const [totalPlayers, setTotalPlayers] = useState(0);
    const [totalAnswers, setTotalAnswers] = useState(0);

    const [loading, setLoading] = useState(true);
    const [usingPowerUp, setUsingPowerUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const expiredRoundRef = useRef<number | null>(null);
    const pendingExpiredRef = useRef<ExpiredPayload | null>(null);

    const getPlayerId = () => {
        if (player?.player_id) return player.player_id;

        try {
            return JSON.parse(sessionStorage.getItem("player") ?? "{}").player_id;
        } catch {
            return undefined;
        }
    };

    const emitRoundExpired = useCallback(() => {
        if (
            !isHost ||
            !roomCode ||
            round === null ||
            expiredRoundRef.current === round
        ) {
            return;
        }

        const payload: ExpiredPayload = { roomCode, roundId: round };

        expiredRoundRef.current = round;

        if (!socket.connected) {
            pendingExpiredRef.current = payload;
            socket.connect();
            return;
        }

        socket.emit("round:time_expired", payload);
    }, [isHost, roomCode, round]);

    const handleEndRound = () => {
        if (!isHost || round === null || correctAlternative !== null) return;

        emitRoundExpired();
        setTimeLeft(0);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
        if (
            event.key !== "Enter" ||
            timeLeft > 0 ||
            round === null ||
            !isHost
        ) {
            return;
        }

        if (position >= totalQuestion) {
            navigate(`/${roomCode}/${round}/podio`);
            return;
        }

        navigate(`/${roomCode}/${round}/ranking`);
    };

    const atualizarPergunta = (data: any) => {
        const questionData = data.questions ?? data;
        const newRound = data.round_id;

        setQuestion({
            id: questionData.question_id ?? questionData.id,
            text: questionData.question_text ?? questionData.text,
            alternatives: questionData.alternatives.map((alternative: any) => ({
                id: alternative.alternative_id ?? alternative.id,
                text: alternative.alternative_text ?? alternative.text,
            })),
        });

        setSkip(data.skip ?? false);
        setRound(newRound);

        if (expiredRoundRef.current !== newRound) {
            pendingExpiredRef.current = null;
        }

        setTotalPlayers(data.totalPlayers ?? 0);
        setTotalAnswers(data.totalAnswers ?? 0);

        const duration = Number(data.time_limit ?? QUESTION_TIME);
        const start = new Date(data.round_opened).getTime();
        const serverNow = new Date(data.server_now).getTime();

        const elapsed =
            Number.isFinite(start) && Number.isFinite(serverNow)
                ? Math.floor((serverNow - start) / 1000)
                : 0;

        setQuestionTime(duration);
        setTimeLeft(Math.max(0, duration - elapsed));

        const playerAnswer = data.answers?.[0];

        setSelectedAnswer(
            playerAnswer?.alternative_id ?? playerAnswer?.alternativeId ?? null
        );
        setAnswered(Boolean(playerAnswer));

        setAlternativeStatistics([]);
        setCorrectAlternative(null);
        setHiddenAlternativeIds([]);
        setError(null);
    };

    const buscarRound = async () => {
        try {
            const playerId = getPlayerId();

            const url = playerId
                ? `/round/${roomCode}/${playerId}/findRound`
                : `/round/${roomCode}/findRound`;

            const [response, responsePlayers] = await Promise.all([
                AXIOS.get(url),
                AXIOS.get(`/player/${roomCode}/podium`),
            ]);

            const data = response.data;

            if (data.type !== "Success" || !data.data) {
                setQuestion(null);
                setError(
                    data.message ?? "Não há pergunta disponível nesta posição."
                );
                return;
            }

            const roundData = data.data;

            setPowerUp(roundData.powers ?? []);
            setTotalQuestion(roundData.count_questions ?? 0);
            setPosition(roundData.position ?? 0);

            const plays = responsePlayers.data.data
                .map((item: any) => item.players)
                .filter((item: any) => item.player_id !== player?.player_id);

            setPlayers(plays);

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

            if (pendingExpiredRef.current) {
                socket.emit("round:time_expired", pendingExpiredRef.current);
                pendingExpiredRef.current = null;
            }
        };

        const findRound = () => void buscarRound();

        const roomFinished = () => {
            navigate("/");
            sessionStorage.clear();
        };

        const handlePowerFifty = (data: PowerFiftyPayload) => {
            if (data.playerId !== getPlayerId()) return;

            setHiddenAlternativeIds(
                data.alternatives.map(item => item.alternative_id)
            );
        };

        const skiped = (data: any) => {
            if (data.target !== player?.player_id) return;

            setSkip(data.skiped);
            setPlayerNameUsed(data.userName);
        };

        const expired = (data: any) => {
            setTimeLeft(0);

            const alternatives: AlternativeStatistics[] = data?.alternative ?? [];

            if (!alternatives.length) return;

            setAlternativeStatistics(alternatives);

            const correct = alternatives.find(item => item.isCorrect);
            setCorrectAlternative(correct?.alternativeId ?? null);
        };

        const answeredUpdate = () => {
            setTotalAnswers(previous => previous + 1);
        };

        const goToRanking = (data: RankingPayload) => {
            if (!data?.roundId || !roomCode) return;

            navigate(`/${roomCode}/${data.roundId}/ranking`);
        };

        socket.on("connect", roomJoin);
        socket.on("question:started", findRound);
        socket.on("room:finished", roomFinished);
        socket.on("room:powerfifty", handlePowerFifty);
        socket.on("room:skip", skiped);
        socket.on("room:expired", expired);
        socket.on("room:answered", answeredUpdate);
        socket.on("room:ranking", goToRanking);

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
            socket.off("room:expired", expired);
            socket.off("room:answered", answeredUpdate);
            socket.off("room:ranking", goToRanking);
        };
    }, [roomCode, player?.player_id]);

    useEffect(() => {
        if (!question || loading || timeLeft <= 0) return;

        const timer = window.setInterval(() => {
            setTimeLeft(previous => {
                if (previous <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return previous - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [question?.id, loading, timeLeft <= 0]);

    useEffect(() => {
        if (!question || loading || !isHost || timeLeft > 0 || round === null) {
            return;
        }

        emitRoundExpired();
    }, [timeLeft, isHost, round, loading, question, emitRoundExpired]);

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
        } catch (err: any) {
            console.error(
                err?.response?.data?.message ?? "Erro ao enviar resposta"
            );

            setError("Não foi possível enviar sua resposta.");
            setAnswered(false);
            setSelectedAnswer(null);
        }
    };

    const handleUsePowerUp = async (
        powerupId: number,
        targetPlayer?: string
    ): Promise<boolean> => {
        const playerId = getPlayerId();

        if (usingPowerUp || !playerId) return false;

        try {
            setUsingPowerUp(true);

            const { data } = await AXIOS.post(
                `/player/${roomCode}/${playerId}/${powerupId}/${player?.player_name}/powerup`,
                targetPlayer ? { target: targetPlayer } : undefined
            );

            if (data.type !== "Success") {
                setError(data.message ?? "Não foi possível utilizar o power-up.");
                return false;
            }

            setPowerUp(previous =>
                previous.map(power =>
                    power.powerup_id === powerupId
                        ? { ...power, used: true }
                        : power
                )
            );

            setSelectedPowerUp(null);
            return true;
        } catch (err) {
            console.error("Erro ao utilizar power-up:", err);
            setError("Não foi possível utilizar o power-up.");
            return false;
        } finally {
            setUsingPowerUp(false);
        }
    };

    const handleGoToRanking = () => {
        if (!roomCode || timeLeft > 0 || round === null || !isHost) return;

        if (position >= totalQuestion) {
            navigate(`/${roomCode}/${round}/podio`);
            return;
        }

        navigate(`/${roomCode}/${round}/ranking`);
    };

    const onConfirmPowerUp = (
        powerupId: number,
        playerId?: string
    ): Promise<boolean> => handleUsePowerUp(powerupId, playerId);

    return {
        progress: (timeLeft / questionTime) * 100,
        isCriticalTime: timeLeft <= 5,
        handleAnswer,
        handleKeyDown,
        handleEndRound,
        onConfirmPowerUp,
        setSelectedPowerUp,
        selectedPowerUp,
        timeLeft,
        loading,
        error,
        question,
        selectedAnswer,
        answered,
        totalPlayers,
        totalAnswers,
        powerUp,
        hiddenAlternativeIds,
        usingPowerUp,
        skip,
        isHost,
        players,
        correctAlternative,
        alternativeStatistics,
        playerNameUsed,
        round,
        handleGoToRanking,
    };
};

export default useRoomLive;
