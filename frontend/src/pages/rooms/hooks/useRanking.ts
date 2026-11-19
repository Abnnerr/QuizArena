import { useEffect, useState } from "react";
import type { ResponseDTO } from "../../../contexts/types/authTypes";
import { useNavigate, useParams } from "react-router";
import { useTheme } from "../../../contexts/ThemeContext";
import { AXIOS } from "../../../service";
import type { PlayerData, RankingWithDiff } from "../pages/ranking/types/types";

export function useRanking() {
    const navigate = useNavigate();
    const { colors } = useTheme();

    const { roomCode, round } = useParams<{
        roomCode: string;
        round: string;
    }>();

    const [rankingList, setRankingList] = useState<RankingWithDiff[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ResponseDTO | null>(null);
    const [animateTrigger, setAnimateTrigger] = useState(false);

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const createErrorResponse = (message: string): ResponseDTO => ({
        type: "Warning",
        message,
    });

    const createNewRound = async (): Promise<void> => {
        if (!roomCode || !round) {
            setError(createErrorResponse("Dados da rodada não encontrados."));
            return;
        }

        setError(null);

        try {
            const { data } = await AXIOS.post(
                `/round/${roomCode}/roundFinished`,
                {
                    round_id: Number(round),
                }
            );

            if (data.type === "Success") {
                navigate(-1);
            }
        } catch (err: any) {
            console.error("Erro ao avançar a rodada:", err);

            const message =
                err?.response?.data?.message ??
                "Não foi possível avançar a rodada.";

            setError(createErrorResponse(message));
        }
    };

    useEffect(() => {
        let active = true;
        let animationTimeout: ReturnType<typeof setTimeout> | undefined;

        const fetchPodium = async (): Promise<void> => {
            try {
                const { data } = await AXIOS.get(
                    `/player/${roomCode}/podium`
                );

                const currentData = data?.data;

                if (!Array.isArray(currentData)) {
                    throw new Error("Formato de ranking inválido.");
                }

                const players: PlayerData[] = currentData.map(
                    (item: any) => ({
                        player_id: item.player_id,
                        player_name: item.players?.player_name ?? "Jogador",
                        score: Number(item.score ?? 0),
                        oldScore: Number(item.oldScore ?? 0),
                    })
                );

                // Ranking anterior.
                const previousRanking = [...players].sort(
                    (a, b) =>
                        b.oldScore - a.oldScore ||
                        String(a.player_id).localeCompare(
                            String(b.player_id)
                        )
                );

                // Ranking atual.
                const currentRanking = [...players].sort(
                    (a, b) =>
                        b.score - a.score ||
                        String(a.player_id).localeCompare(
                            String(b.player_id)
                        )
                );

                // Posições anteriores.
                const previousPositions = new Map<string, number>();

                previousRanking.forEach((player, index) => {
                    previousPositions.set(
                        String(player.player_id),
                        index + 1
                    );
                });

                // Calcula posições atuais e diferenças.
                const processedRanking: RankingWithDiff[] =
                    currentRanking.map((player, index) => {
                        const currentPos = index + 1;

                        const prevPos =
                            previousPositions.get(
                                String(player.player_id)
                            ) ?? currentPos;

                        return {
                            ...player,
                            currentPos,
                            prevPos,
                            diff: prevPos - currentPos,
                        };
                    });

                // Recupera os jogadores na ordem anterior.
                const processedById = new Map(
                    processedRanking.map((player) => [
                        String(player.player_id),
                        player,
                    ])
                );

                const initialRanking: RankingWithDiff[] =
                    previousRanking
                        .map((player) =>
                            processedById.get(String(player.player_id))
                        )
                        .filter(
                            (player): player is RankingWithDiff =>
                                player !== undefined
                        );

                if (!active) return;

                // Exibe primeiro a classificação anterior.
                setAnimateTrigger(false);
                setRankingList(initialRanking);
                setLoading(false);

                // Depois atualiza para a classificação atual.
                animationTimeout = setTimeout(() => {
                    if (!active) return;

                    setRankingList(processedRanking);
                    setAnimateTrigger(true);
                }, 350);

            } catch (err: any) {
                console.error("Erro ao carregar o ranking:", err);

                if (!active) return;

                const message =
                    err?.response?.data?.message ??
                    err?.message ??
                    "Não foi possível carregar o ranking.";

                setError(createErrorResponse(message));
                setLoading(false);
            }
        };

        if (!roomCode) {
            setError(
                createErrorResponse("Código da sala não encontrado.")
            );
            setLoading(false);

            return () => {
                active = false;
            };
        }

        setError(null);
        void fetchPodium();

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
        error,
        animateTrigger,
        cardStyle,
        createNewRound,
        colors
    };
}
