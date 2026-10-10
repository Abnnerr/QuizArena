
import { useCallback, useEffect, useState } from "react";
import { AXIOS } from "../../../service";

export interface LobbyPlayer {
    id: string | number;
    username: string;
    isHost: boolean;
    isReady: boolean;
}

export interface LobbyRoom {
    id: string | number;
    name: string;
    code: string;
    maxPlayers: number;
    mode: "NORMAL" | "HARDCORE";
    status: string;
    players: LobbyPlayer[];
}

interface UseLobbyOptions {
    roomId?: string;
}

export const useLobby = ({ roomId }: UseLobbyOptions = {}) => {
    const [room, setRoom] = useState<LobbyRoom | null>(null);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchRoom = useCallback(async () => {
        if (!roomId) {
            setError("ID da sala não informado.");
            setLoading(false);
            return;
        }

        try {
            setError(null);

            const response = await AXIOS.get(`/rooms/${roomId}`);
            const data = response.data;

            setRoom({
                ...data,
                players: data.players ?? [],
            });
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Não foi possível carregar a sala."
            );
        } finally {
            setLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        void fetchRoom();
    }, [fetchRoom]);

    const toggleReady = async () => {
        try {
            setError(null);

            await AXIOS.patch(`/rooms/${roomId}/start`);

            await fetchRoom();
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Não foi possível alterar seu status."
            );
        }
    };

    const startGame = async () => {
        if (!room || starting) return;

        if (room.players.length < 2) {
            setError("É necessário ter pelo menos 2 jogadores.");
            return;
        }

        try {
            setStarting(true);
            setError(null);

            await AXIOS.post(`/rooms/${roomId}/start`);

        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Não foi possível iniciar a partida."
            );
        } finally {
            setStarting(false);
        }
    };

    return {
        room,
        loading,
        starting,
        error,
        fetchRoom,
        toggleReady,
        startGame,
    };
};