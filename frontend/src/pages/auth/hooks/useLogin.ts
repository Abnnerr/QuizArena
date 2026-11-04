
import type { ResponseDTO } from "../../../contexts/types/authTypes";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";

export function useLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [feedback, setFeedback] = useState<ResponseDTO | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setFeedback(null);
        setLoading(true);

        try {
            const dados = { userName, password };
            const response = await login(dados);

            if (response.type === 'Success') {
                setFeedback({
                    type: "Success",
                    message: response.message || "Usuário logado com sucesso!"
                });
                setTimeout(() => {
                    setFeedback(null);
                    navigate('/');
                }, 1500);
            } else {
                setFeedback({
                    type: "Warning",
                    message: response.message || "Credenciais inválidas"
                });
                setTimeout(() => {
                    setFeedback(null);
                }, 2000);
            }
        } catch (error: any) {
            setFeedback({
                type: "Warning",
                message: error?.response?.data?.message || error.message || "Erro ao tentar logar. Tente novamente."
            });
            setTimeout(() => {
                setFeedback(null);
            }, 1500);
        } finally {
            setLoading(false);
        }
    }

    return {
        userName,
        password,
        showPassword,
        feedback,
        loading,
        setLoading,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit
    };
}