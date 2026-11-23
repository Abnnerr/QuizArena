import { useCallback, useEffect, useState } from "react";
import { AXIOS } from "../../../service";
import { socket } from "../../../service/socket";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useNavigate } from "react-router";
import type { ResponseDTO } from "../../../contexts/types/authTypes";



export interface LobbyPlayer {
    player_id: string;
    player_name: string;
    ready: boolean;
}

export interface LobbyRoom {
    room_id: number;
    host_id: string;
    room_name: string;
    room_code: string;
    max_players: number;
    room_mode: "NORMAL" | "HARDCORE";
    room_status: string;
    players: LobbyPlayer[];
}

export type ResponseFetchRoom = {
    type: "Success" | "Warning";
    message: string;
    data: FetchRoom;
};

export type FetchRoom = {
    host_user_id: string;
    max_players: number;
    room_id: number;
    room_code: string;
    room_name: string;
    host_id: string;
    room_mode: "NORMAL" | "HARDCORE";
    room_status: string;
    roomPlayers: {
        players: {
            player_id: string;
            player_name: string;
        };
        ready: boolean;
    }[];
};

interface UseLobbyProps {
    roomCode?: string;
}

export const useLobby = ({ roomCode }: UseLobbyProps) => {
    const { player, clearPlayer } = usePlayer();
    const navigate = useNavigate();

    const [room, setRoom] = useState<LobbyRoom | null>(null);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ResponseDTO | null>(null);

    const createWarning = (message: string): ResponseDTO => ({
        type: "Warning",
        message,
    });

    const fetchRoom = useCallback(async (): Promise<void> => {
        if (!roomCode) {
            setError(createWarning("Código da sala não informado."));
            setLoading(false);
            return;
        }

        try {
            setError(null);

            const { data } = await AXIOS.get<ResponseFetchRoom>(
                `/room/${roomCode}`
            );

            if (data.type === "Warning") {
                setError(data);
                setRoom(null);
                return;
            }

            setRoom({
                room_id: data.data.room_id,
                room_code: data.data.room_code,
                room_name: data.data.room_name,
                host_id: data.data.host_user_id,
                max_players: data.data.max_players,
                room_mode: data.data.room_mode,
                room_status: data.data.room_status,
                players: data.data.roomPlayers.map((p) => ({
                    ...p.players,
                    ready: p.ready,
                })),
            });

        } catch (err: any) {
            const response = err?.response?.data;

            setError(
                response?.type === "Warning"
                    ? response
                    : createWarning(
                        response?.message ??
                        "Não foi possível carregar a sala."
                    )
            );
        } finally {
            setLoading(false);
        }
    }, [roomCode]);

    useEffect(() => {
        if (!roomCode) return;

        sessionStorage.removeItem("position");

        void fetchRoom();

        const joinRoom = () => socket.emit("room:join", roomCode);
        const handleUpdate = () => void fetchRoom();

        const handleStartRoom = () => {
            void navigate(`/room/${roomCode}/live`);
        };

        const returnHome = ({ playerId }: { playerId: string }) => {
            if (playerId !== player?.player_id) return;

            clearPlayer();
            void navigate("/");
        };

        socket.on("connect", joinRoom);
        socket.on("room:join", handleUpdate);
        socket.on("room:update", handleUpdate);
        socket.on("room:start", handleStartRoom);
        socket.on("player:ready", handleUpdate);
        socket.on("player:removed", returnHome);

        if (!socket.connected) {
            socket.connect();
        } else {
            joinRoom();
        }

        return () => {
            socket.off("connect", joinRoom);
            socket.off("room:join", handleUpdate);
            socket.off("room:update", handleUpdate);
            socket.off("room:ready", handleUpdate);
            socket.off("room:start", handleStartRoom);
            socket.off("player:ready", handleUpdate);
            socket.off("player:removed", returnHome);
        };
    }, [roomCode, fetchRoom, navigate, player?.player_id, clearPlayer]);

    const toggleReady = async (): Promise<boolean> => {
        if (!player?.player_id || !room?.room_id || !roomCode) {
            return false;
        }

        try {
            setError(null);

            const nextReady = !ready;

            const { data } = await AXIOS.patch<ResponseDTO>(
                `/player/${player.player_id}/${roomCode}/ready`,
                {
                    ready: nextReady,
                }
            );

            if (data.type !== "Success") {
                setError(data);
                return false;
            }

            setReady(nextReady);

            await fetchRoom();

            return true;

        } catch (err: any) {
            const response = err?.response?.data;

            setError(
                response?.type === "Warning"
                    ? response
                    : createWarning(
                        response?.message ?? "Erro ao alterar status."
                    )
            );

            return false;
        }
    };



    const toggleLeave = async (): Promise<void> => {
        if (player?.player_id) {
            socket.emit("player:leave", {
                roomCode,
                playerId: player.player_id,
            });
        }

        clearPlayer();
        navigate("/");
    };

    return {
        room,
        loading,
        ready,
        error,
        fetchRoom,
        toggleReady,
        toggleLeave,
    };
};
