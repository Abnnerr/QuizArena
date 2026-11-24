
import { useState } from "react";
import { useAuth } from "../../../contexts/hooks/useAuth";
import { useToast } from "../../../contexts/ToastContext";

export const useForgot = () => {
    const { forgot } = useAuth();
    const { toast } = useToast();

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!email.trim()) {
            toast.warning("Informe o seu e-mail cadastrado.");
            return;
        }

        setLoading(true);

        try {
            const response = await forgot(email.trim());

            if (response.type === "Success") {
                toast.success(
                    response.message ||
                    "Instruções enviadas! Verifique sua caixa de entrada."
                );

                setEmail("");
            } else {
                toast.warning(
                    response.message ||
                    "Não foi possível enviar o e-mail de recuperação."
                );
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Erro ao conectar com o servidor."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        loading,
        setEmail,
        handleSubmit,
    };
};
