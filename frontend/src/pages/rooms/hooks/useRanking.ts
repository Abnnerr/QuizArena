
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AXIOS } from "../../../service";
import type { PlayerData, RankingWithDiff } from "../pages/ranking/types/types";

export function useRanking() {
    const navigate = useNavigate();

    const { roomCode, round } = useParams<{
        roomCode: string;
        round: string;
    }>();

    const [rankingList, setRankingList] = useState<RankingWithDiff[]>([]);
    const [loading, setLoading] = useState(true);
    const [advancing, setAdvancing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    const createNewRound = useCallback(async () => {
        if (!roomCode || !round || advancing) {
            if (!roomCode || !round) {
                setError("Não foi possível identificar a rodada atual.");
            }
            return;
        }

        try {
            setAdvancing(true);
            setError(null);

            const { data } = await AXIOS.post(
                `/round/${roomCode}/roundFinished`,
                {
                    round_id: Number(round),
                }
            );

            if (data.type !== "Success") {
                throw new Error(
                    data.message || "Não foi possível avançar a rodada."
                );
            }

            navigate(-1);
        } catch (err: any) {
            console.error("Erro ao avançar a rodada:", err);

            setError(
                err?.response?.data?.message ??
                err?.message ??
                "Não foi possível avançar a rodada."
            );
        } finally {
            setAdvancing(false);
        }
    }, [roomCode, round, advancing, navigate]);

    useEffect(() => {
        let active = true;
        let animationTimeout: ReturnType<typeof setTimeout> | undefined;

        const fetchRanking = async () => {
            try {
                setLoading(true);
                setError(null);
                setAnimateTrigger(false);

                if (!roomCode) {
                    throw new Error("Código da sala não encontrado.");
                }

                const { data } = await AXIOS.get(
                    `/player/${roomCode}/podium`
                );

                const currentData = data?.data;

                if (!Array.isArray(currentData)) {
                    throw new Error("Formato de classificação inválido.");
                }

                const players: PlayerData[] = currentData.map((item: any) => ({
                    player_id: item.player_id,
                    player_name: item.players?.player_name ?? "Jogador",
                    score: Number(item.score ?? 0),
                    oldScore: Number(item.oldScore ?? 0),
                }));

                const previousRanking = [...players].sort(
                    (a, b) =>
                        b.oldScore - a.oldScore ||
                        String(a.player_id).localeCompare(String(b.player_id))
                );

                const currentRanking = [...players].sort(
                    (a, b) =>
                        b.score - a.score ||
                        String(a.player_id).localeCompare(String(b.player_id))
                );

                const previousPositions = new Map<string, number>();

                previousRanking.forEach((player, index) => {
                    previousPositions.set(
                        String(player.player_id),
                        index + 1
                    );
                });

                const processedRanking: RankingWithDiff[] =
                    currentRanking.map((player, index) => {
                        const currentPos = index + 1;
                        const prevPos =
                            previousPositions.get(String(player.player_id)) ??
                            currentPos;

                        return {
                            ...player,
                            currentPos,
                            prevPos,
                            diff: prevPos - currentPos,
                        };
                    });

                const processedById = new Map(
                    processedRanking.map((player) => [
                        String(player.player_id),
                        player,
                    ])
                );

                const initialRanking = previousRanking
                    .map((player) =>
                        processedById.get(String(player.player_id))
                    )
                    .filter(
                        (player): player is RankingWithDiff =>
                            player !== undefined
                    );

                if (!active) return;

                setRankingList(initialRanking);
                setLoading(false);

                animationTimeout = setTimeout(() => {
                    if (!active) return;

                    setRankingList(processedRanking);
                    setAnimateTrigger(true);
                }, 500);
            } catch (err: any) {
                console.error("Erro ao carregar a classificação:", err);

                if (!active) return;

                setError(
                    err?.response?.data?.message ??
                    err?.message ??
                    "Não foi possível carregar a classificação."
                );
                setLoading(false);
            }
        };

        void fetchRanking();

        return () => {
            active = false;

            if (animationTimeout) {
                clearTimeout(animationTimeout);
            }
        };
    }, [roomCode]);

    return {
        rankingList,
        loading,
        advancing,
        error,
        animateTrigger,
        createNewRound,
    };
}
