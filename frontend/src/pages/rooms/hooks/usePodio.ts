import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AXIOS } from "../../../service";
import type { ResponseDTO } from "../../../contexts/types/authTypes";

type PlayerData = {
    player_id: string | number;
    score: number;
    players?: {
        player_name: string;
    };
    player_name?: string;
};

interface PodiumApiResponse {
    type?: "Success" | "Warning";
    message?: string;
    data?: PlayerData[];
}

const createWarning = (message: string): ResponseDTO => ({
    type: "Warning",
    message,
});

const usePodio = () => {
    const navigate = useNavigate();

    const { roomCode, round } = useParams<{
        roomCode: string;
        round: string;
    }>();

    const [topThree, setTopThree] = useState<PlayerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ResponseDTO | null>(null);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const fetchPodiumTop3 = async () => {
            try {
                setLoading(true);
                setError(null);

                const { data: response } = await AXIOS.get<PodiumApiResponse | PlayerData[]>(
                    `/player/${roomCode}/podium`
                );

                // Verifica se o backend retornou um Warning.
                if (
                    !Array.isArray(response) &&
                    response.type === "Warning"
                ) {
                    setError(
                        createWarning(
                            response.message ?? "Não foi possível carregar o pódio."
                        )
                    );
                    return;
                }

                // Compatibilidade com resposta envelopada ou array direto.
                const currentData: PlayerData[] = Array.isArray(response)
                    ? response
                    : response.data ?? [];

                if (!Array.isArray(currentData)) {
                    setError(
                        createWarning("Formato de dados do pódio inválido.")
                    );
                    return;
                }

                const sorted = [...currentData].sort(
                    (a, b) => b.score - a.score
                );

                setTopThree(sorted.slice(0, 3));
            } catch (err: unknown) {
                console.error("Erro ao carregar o pódio final:", err);

                const message =
                    typeof err === "object" &&
                        err !== null &&
                        "response" in err &&
                        typeof err.response === "object" &&
                        err.response !== null &&
                        "data" in err.response &&
                        typeof err.response.data === "object" &&
                        err.response.data !== null &&
                        "message" in err.response.data &&
                        typeof err.response.data.message === "string"
                        ? err.response.data.message
                        : "Não foi possível carregar o pódio da partida.";

                setError(createWarning(message));
            } finally {
                setLoading(false);
            }
        };

        if (roomCode) {
            void fetchPodiumTop3();
        } else {
            setError(createWarning("Código da sala não encontrado."));
            setLoading(false);
        }
    }, [roomCode]);

    // Revelação gradual dos jogadores.
    useEffect(() => {
        if (topThree.length === 0 || loading) return;

        let currentStep = 0;

        const interval = setInterval(() => {
            currentStep += 1;
            setVisibleCount(currentStep);

            if (currentStep >= 3) {
                clearInterval(interval);
            }
        }, 1200);

        return () => clearInterval(interval);
    }, [topThree, loading]);

    // Organização visual: segundo, primeiro e terceiro lugar.
    const orderedPodium = topThree.length === 3
        ? [
            { player: topThree[1], originalIndex: 1 },
            { player: topThree[0], originalIndex: 0 },
            { player: topThree[2], originalIndex: 2 },
        ]
        : topThree.map((player, index) => ({
            player,
            originalIndex: index,
        }));

    // Encerramento e limpeza da sala.
    async function clearRoom() {
        try {
            setError(null);

            const { data } = await AXIOS.delete<ResponseDTO>(
                `/room/${roomCode}/${round}/limpar`
            );

            if (data.type === "Success") {
                navigate("/");
                return;
            }

            setError(
                createWarning(
                    data.message || "Não foi possível encerrar a partida."
                )
            );
        } catch (err: unknown) {
            console.error("Erro ao limpar a sala:", err);

            const message =
                typeof err === "object" &&
                    err !== null &&
                    "response" in err &&
                    typeof err.response === "object" &&
                    err.response !== null &&
                    "data" in err.response &&
                    typeof err.response.data === "object" &&
                    err.response.data !== null &&
                    "message" in err.response.data &&
                    typeof err.response.data.message === "string"
                    ? err.response.data.message
                    : "Não foi possível encerrar a partida.";

            setError(createWarning(message));
        }
    }

    return {
        orderedPodium,
        error,
        visibleCount,
        clearRoom,
        navigate,
        loading,
        topThree,
    };
};

export default usePodio;
