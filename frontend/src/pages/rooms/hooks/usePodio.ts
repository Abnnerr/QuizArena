
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { AXIOS } from "../../../service";
import type { ResponseDTO } from "../../../contexts/types/authTypes";

type PlayerData = {
    player_id: string | number;
    score: number;
    player_name: string;
    players?: {
        player_name: string;
    };
};

type PodiumApiResponse = {
    type?: "Success" | "Warning";
    message?: string;
    data?: PlayerData[];
};

type OrderedPlayer = {
    player: PlayerData;
    originalIndex: number;
    revealOrder: number;
};

function getErrorMessage(
    error: unknown,
    fallback: string
): string {
    if (typeof error !== "object" || error === null) {
        return fallback;
    }

    const err = error as {
        message?: string;
        response?: {
            data?: {
                message?: string;
            };
        };
    };

    return (
        err.response?.data?.message ||
        err.message ||
        fallback
    );
}

const usePodio = () => {
    const navigate = useNavigate();

    const { roomCode, round } = useParams<{
        roomCode: string;
        round: string;
    }>();

    const [topThree, setTopThree] = useState<PlayerData[]>([]);
    const [visibleCount, setVisibleCount] = useState(0);

    const [loading, setLoading] = useState(true);
    const [clearing, setClearing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Busca os resultados da partida.
    const fetchPodium = useCallback(async () => {
        if (!roomCode) {
            setTopThree([]);
            setError("Código da sala não encontrado.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            setVisibleCount(0);
            setTopThree([]);

            const { data: response } = await AXIOS.get<
                PodiumApiResponse | PlayerData[]
            >(`/player/${roomCode}/podium`);

            if (
                !Array.isArray(response) &&
                response.type === "Warning"
            ) {
                throw new Error(
                    response.message || "Não foi possível carregar o pódio."
                );
            }

            const players = Array.isArray(response)
                ? response
                : response.data;

            if (!Array.isArray(players)) {
                throw new Error("Formato de dados do pódio inválido.");
            }

            const sorted = [...players]
                .map((player) => ({
                    ...player,
                    player_name:
                        player.players?.player_name ??
                        player.player_name ??
                        "Jogador",
                    score: Number(player.score ?? 0),
                }))
                .sort((a, b) => b.score - a.score);

            setTopThree(sorted.slice(0, 3));
        } catch (err: unknown) {
            console.error("Erro ao carregar o pódio:", err);

            setTopThree([]);
            setError(
                getErrorMessage(
                    err,
                    "Não foi possível carregar o pódio da partida."
                )
            );
        } finally {
            setLoading(false);
        }
    }, [roomCode]);

    // Carrega o pódio quando a sala muda.
    useEffect(() => {
        void fetchPodium();
    }, [fetchPodium]);

    // Revela os jogadores gradualmente.
    useEffect(() => {
        if (loading || topThree.length === 0) {
            setVisibleCount(0);
            return;
        }

        setVisibleCount(0);

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep += 1;

            setVisibleCount(currentStep);

            if (currentStep >= topThree.length) {
                clearInterval(interval);
            }
        }, 1200);

        return () => clearInterval(interval);
    }, [topThree, loading]);

    // Organiza visualmente: segundo, primeiro e terceiro.
    const orderedPodium: OrderedPlayer[] = topThree.length === 3
        ? [
            {
                player: topThree[1],
                originalIndex: 1,
                revealOrder: 2,
            },
            {
                player: topThree[0],
                originalIndex: 0,
                revealOrder: 3,
            },
            {
                player: topThree[2],
                originalIndex: 2,
                revealOrder: 1,
            },
        ]
        : topThree.map((player, index) => ({
            player,
            originalIndex: index,
            revealOrder: topThree.length - index,
        }));

    // Encerra a partida e limpa a sala.
    const clearRoom = useCallback(async () => {
        if (!roomCode || !round || clearing) {
            setError("Não foi possível identificar a partida atual.");
            return;
        }

        try {
            setClearing(true);
            setError(null);

            const { data } = await AXIOS.delete<ResponseDTO>(
                `/room/${roomCode}/${round}/limpar`
            );

            if (data.type === "Success") {
                navigate("/dashboard");
                return;
            }

            setError(
                data.message || "Não foi possível encerrar a partida."
            );
        } catch (err: unknown) {
            console.error("Erro ao encerrar a partida:", err);

            setError(
                getErrorMessage(
                    err,
                    "Não foi possível encerrar a partida."
                )
            );
        } finally {
            setClearing(false);
        }
    }, [roomCode, round, clearing, navigate]);

    return {
        topThree,
        orderedPodium,
        visibleCount,
        loading,
        clearing,
        error,
        clearRoom,
        reloadPodium: fetchPodium,
    };
};

export default usePodio;
