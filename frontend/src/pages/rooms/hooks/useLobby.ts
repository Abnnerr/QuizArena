import { useCallback, useEffect, useState } from "react";
import { AXIOS } from "../../../service";
import { socket } from "../../../service/socket";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useNavigate } from "react-router";

export interface LobbyPlayer {
    player_id: string
    player_name: string
    ready: boolean
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
    type: "Success" | "Warning"
    message: string
    data: FetchRoom
}
export type FetchRoom = {
    host_user_id: string
    max_players: number
    room_id: number,
    room_code: string,
    room_name: string,
    host_id: string,
    room_mode: "NORMAL" | "HARDCORE",
    room_status: string,
    roomPlayers: {
        players: {
            player_id: string
            player_name: string

        }
        ready: boolean
    }[]
}

export const useLobby = ({ roomCode }: { roomCode?: string }) => {
    const { player, clearPlayer } = usePlayer();
    const navigate = useNavigate()
    const [room, setRoom] = useState<LobbyRoom | null>(null);
    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [starting, setStarting] = useState(false);
    const [error, setError] = useState<string | null>(null);




    const fetchRoom = useCallback(async () => {
        if (!roomCode) {
            setError("Código da sala não informado.");
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const { data } = await AXIOS.get<ResponseFetchRoom>(`/room/${roomCode}`);
            console.log('dataaa');

            if (data.type === "Success") {
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
                        ready: p.ready
                    }))

                })
                return
            }
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Não foi possível carregar a sala.");
        } finally {
            setLoading(false);
        }
    }, [roomCode, player?.player_id]);





    useEffect(() => {
        if (!roomCode) return;

        void fetchRoom();
        const joinRoom = () => socket.emit("room:join", roomCode);
        const handleUpdate = () => void fetchRoom();
        const startRoom = () => void navigate(`/room/${roomCode}/start`);
        const returnHome = ({ playerId }: { playerId: string }) => {
            if (playerId !== player?.player_id) return
            clearPlayer()
            void navigate('/')
        }

        socket.on("connect", joinRoom);
        socket.on("room:join", handleUpdate);
        socket.on("room:update", handleUpdate);
        socket.on("room:start", startRoom);
        socket.on("player:ready", handleUpdate);
        socket.on("player:removed", returnHome)

        if (!socket.connected) {
            socket.connect();
        } else {
            joinRoom();
        }

        return () => {
            socket.off("connect", joinRoom);
            socket.off("room:join", handleUpdate);
            socket.off("player:ready", handleUpdate);
            socket.off("room:start", startRoom);
            socket.off("player:removed", returnHome)
        };
    }, [roomCode, fetchRoom, navigate, player?.player_id]);

    const toggleReady = async (): Promise<boolean> => {
        if (!player?.player_id || !room?.room_id) return false;

        try {
            setError(null);
            if (ready) {
                const { data } = await AXIOS.patch(`/room/${player.player_id}/${room.room_id}/ready`, {
                    ready: false
                });
                if (data.type !== "Success") {
                    return false;
                }
                setReady(false)

                return true
            }
            const { data } = await AXIOS.patch(`/room/${player.player_id}/${room.room_id}/ready`, {
                ready: true
            });
            if (data.type !== "Success") {
                return false;
            }
            setReady(true)

            await fetchRoom();
            return true;
        } catch (err: any) {
            setError(err?.response?.data?.message ?? "Erro ao alterar status.");
            return false;
        }
    };

    const startRoom = async (): Promise<boolean> => {
        console.log(room?.room_id);

        if (!room?.room_id) return false;

        try {
            setStarting(true);
            setError(null);

            const { data } = await AXIOS.get(`/room/${room.room_id}/start`);

            if (data.type !== "Success") {
                setError(data.message ?? "Não foi possível iniciar a partida.");
                return false;
            }

            return true;
        } catch (err: any) {
            setError(
                err?.response?.data?.message ??
                "Erro ao iniciar a partida."
            );
            return false;
        } finally {
            setStarting(false);
        }
    };

    const toggleLeave = async () => {

        if (player?.player_id) {
            socket.emit("player:leave", {
                roomCode: roomCode,
                playerId: player.player_id,
            });
        }
        clearPlayer();
        navigate('/')
    }
    return {
        room,
        loading,
        ready,
        starting,
        error,
        fetchRoom,
        toggleReady,
        startRoom,
        toggleLeave
    };
};