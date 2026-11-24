
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";

export function useLogin() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            setLoading(true);

            const response = await login({ userName, password });

            if (response.type !== "Success") {
                toast.warning(response.message || "Credenciais inválidas.");
                return;
            }

            toast.success(response.message || "Usuário logado com sucesso!");
            navigate("/");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ||
                error.message ||
                "Erro ao tentar fazer login."
            );
        } finally {
            setLoading(false);
        }
    }

    return {
        userName,
        password,
        showPassword,
        loading,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit,
    };
}
