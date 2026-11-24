
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import { useAuth } from "../../../contexts/hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";

export const useReset = () => {
    const navigate = useNavigate();
    const { reset } = useAuth();
    const { toast } = useToast();

    const { token } = useParams<{ token: string }>();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isPasswordValid =
        hasMinLength &&
        hasUpper &&
        hasLower &&
        hasNumber &&
        hasSpecial;

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!token) {
            toast.warning("Token de redefinição inválido ou ausente.");
            return;
        }

        if (!isPasswordValid) {
            toast.warning(
                "A senha precisa atender a todos os requisitos de segurança."
            );
            return;
        }

        if (password !== confirmPassword) {
            toast.warning("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        try {
            const response = await reset(password, token);

            if (response.type === "Success") {
                toast.success(
                    response.message ||
                    "Senha alterada com sucesso! Redirecionando..."
                );

                setTimeout(() => {
                    navigate("/auth/login");
                }, 2000);
            } else {
                toast.warning(
                    response.message ||
                    "Não foi possível redefinir sua senha."
                );
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Erro ao redefinir senha. O link pode ter expirado."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        loading,
        handleSubmit,
    };
};
