
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { AxiosError } from "axios";

import { useAuth } from "../../../contexts/hooks/useAuth";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { AXIOS } from "../../../service";
import { useToast } from "../../../contexts/hooks/useToast";

type HomeStep = "room" | "name";

interface ApiError {
    message?: string;
}

export function useHome() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { user } = useAuth();
    const { setPlayer } = usePlayer();
    const { toast } = useToast();

    const [step, setStep] = useState<HomeStep>("room");
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const processedRoom = useRef<string | null>(null);

    const handleJoinRoom = useCallback(async (codeFromUrl?: string) => {
        const code = (codeFromUrl ?? roomCode).trim().toUpperCase();

        if (!code) {
            toast.warning("Informe o código da sala.");
            return;
        }

        try {
            setLoading(true);
            setRoomCode(code);

            const { data } = await AXIOS.get(`/room/${code}`);

            if (data.type !== "Success") {
                toast.warning(data.message || "Sala não encontrada.");
                return;
            }

            if (user) {
                navigate(`/room/${code}/lobby`);
                return;
            }

            setStep("name");
            toast.success("Sala encontrada!");
        } catch (error) {
            const err = error as AxiosError<ApiError>;

            toast.error(
                err.response?.data?.message ||
                "Não foi possível entrar na sala."
            );
        } finally {
            setLoading(false);
        }
    }, [roomCode, user, navigate, toast]);

    useEffect(() => {
        const code = searchParams.get("room")?.trim().toUpperCase();

        if (!code || code.length > 12) return;
        if (processedRoom.current === code) return;

        processedRoom.current = code;

        setRoomCode(code);
        void handleJoinRoom(code);
    }, [searchParams, handleJoinRoom]);

    const handlePlayerSubmit = async () => {
        const name = playerName.trim();
        const code = roomCode.trim().toUpperCase();

        if (name.length < 2) {
            toast.warning("O nome deve ter pelo menos 2 caracteres.");
            return;
        }

        if (!code) {
            toast.warning("Código da sala não informado.");
            setStep("room");
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.post(`/room/join/${code}`, {
                userName: name,
            });

            if (data.type !== "Success" || !data.data) {
                toast.warning(data.message || "Não foi possível entrar na sala.");
                return;
            }

            setPlayer({
                player_id: data.data.player_id,
                player_name: data.data.player_name,
            });

            toast.success("Você entrou na sala!");

            navigate(`/room/${code}/lobby`);
        } catch (error) {
            const err = error as AxiosError<ApiError>;

            toast.error(
                err.response?.data?.message ||
                "Não foi possível entrar na sala."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        setStep("room");
        setPlayerName("");
    };

    return {
        step,
        roomCode,
        setRoomCode,
        playerName,
        setPlayerName,
        loading,
        handleJoinRoom,
        handlePlayerSubmit,
        handleBack,
    };
}
