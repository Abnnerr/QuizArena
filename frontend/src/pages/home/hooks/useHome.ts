
import { useState } from "react";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";

import { useAuth } from "../../../contexts/hooks/useAuth";
import { usePlayer } from "../../../contexts/hooks/usePlayer";
import { useToast } from "../../../contexts/ToastContext";
import { AXIOS } from "../../../service";

type HomeStep = "room" | "name";

interface ApiError {
    message?: string;
}

export function useHome() {
    const navigate = useNavigate();

    const { user } = useAuth();
    const { setPlayer } = usePlayer();
    const { toast } = useToast();

    const [step, setStep] = useState<HomeStep>("room");
    const [roomCode, setRoomCode] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [loading, setLoading] = useState(false);

    const handleJoinRoom = async () => {
        const code = roomCode.trim();

        if (!code) {
            toast.warning("Informe o código da sala.");
            return;
        }

        try {
            setLoading(true);

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
                err.response?.data?.message || "Não foi possível entrar na sala."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePlayerSubmit = async () => {
        const name = playerName.trim();

        if (name.length < 2) {
            toast.warning("O nome deve ter pelo menos 2 caracteres.");
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.post(`/room/join/${roomCode}`, {
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

            navigate(`/room/${roomCode}/lobby`);
        } catch (error) {
            const err = error as AxiosError<ApiError>;

            toast.error(
                err.response?.data?.message || "Não foi possível entrar na sala."
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
