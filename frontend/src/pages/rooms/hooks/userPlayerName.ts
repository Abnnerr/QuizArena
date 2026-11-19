import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router';
import { AXIOS } from '../../../service';
import { usePlayer } from '../../../contexts/hooks/usePlayer';
import type { ResponseDTO } from '../../../contexts/types/authTypes';


export const usePlayerName = () => {
    const { roomName } = useParams<{ roomName: string }>();

    const { setPlayer } = usePlayer();
    const navigate = useNavigate();

    const [playerName, setPlayerName] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<ResponseDTO | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);

        if (!playerName.trim()) {
            setError({
                type: "Warning",
                message: "Por favor, informe seu nome de jogador.",
            } as ResponseDTO);
            return;
        }

        if (playerName.trim().length < 2) {
            setError({
                type: "Warning",
                message: "O apelido deve ter pelo menos 2 caracteres.",
            } as ResponseDTO);
            return;
        }

        setLoading(true);

        try {
            const dados = {
                userName: playerName.trim(),
            };

            const { data } = await AXIOS.post(
                `/room/join/${roomName}`,
                dados
            );

            if (data.type === "Success" || data) {
                setPlayer({
                    player_id: data.data.player_id,
                    player_name: data.data.player_name,
                });

                navigate(`/room/${roomName}/lobby`);
            }
        } catch (err: any) {
            console.error("Erro ao definir nome do jogador:", err);

            setError({
                type: "Warning",
                message:
                    err?.response?.data?.message ??
                    "Não foi possível salvar o apelido. Tente novamente.",
            } as ResponseDTO);
        } finally {
            setLoading(false);
        }
    };

    return {
        playerName,
        setPlayerName,
        loading,
        error,
        handleSubmit,
    };
};