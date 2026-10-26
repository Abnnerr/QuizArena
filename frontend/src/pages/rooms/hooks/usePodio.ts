import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { AXIOS } from "../../../service";

type PlayerData = {
    player_id: string | number;
    score: number;
    players?: {
        player_name: string;
    };
    player_name?: string;
};


const usePodio = () => {
    const navigate = useNavigate();
    const { roomCode, round } = useParams<{ roomCode: string; round: string }>();

    const [topThree, setTopThree] = useState<PlayerData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [visibleCount, setVisibleCount] = useState(0);

    useEffect(() => {
        const fetchPodiumTop3 = async () => {
            try {
                const { data: response } = await AXIOS.get(`/player/${roomCode}/podium`);
                const currentData: PlayerData[] = response?.data ?? response ?? [];

                if (!Array.isArray(currentData)) {
                    setError('Formato de dados do pódio inválido.');
                    return;
                }

                const sorted = [...currentData].sort((a, b) => b.score - a.score);
                setTopThree(sorted.slice(0, 3));
            } catch (err) {
                console.error('Erro ao carregar o pódio final:', err);
                setError('Não foi possível carregar o pódio da partida.');
            } finally {
                setLoading(false);
            }
        };

        if (roomCode) {
            void fetchPodiumTop3();
        } else {
            setError('Código da sala não encontrado.');
            setLoading(false);
        }
    }, [roomCode]);

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

    const orderedPodium = topThree.length === 3
        ? [
            { player: topThree[1], originalIndex: 1 },
            { player: topThree[0], originalIndex: 0 },
            { player: topThree[2], originalIndex: 2 },
        ] : topThree.map((p, idx) => ({ player: p, originalIndex: idx }));

    async function clearRoom() {
        try {
            const { data } = await AXIOS.delete(`/room/${roomCode}/${round}/limpar`);

            if (data.type === "Success") {
                navigate('/');
            }
        } catch (error) {
            console.error('Erro ao limpar a sala:', error);
        }
    }

    return {
        orderedPodium,
        error,
        visibleCount,
        clearRoom,
        navigate,
        loading,
        topThree
    }
}

export default usePodio;