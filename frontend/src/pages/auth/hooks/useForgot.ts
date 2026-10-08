import { useState } from 'react';
import type { ResponseDTO } from '../../../contexts/types/authTypes';
import { useAuth } from '../../../contexts/hooks/useAuth';

export const useForgot = () => {
    const { forgot } = useAuth()

    const [email, setEmail] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<ResponseDTO | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);

        if (!email.trim()) {
            setFeedback({
                type: 'Warning',
                message: 'Informe o seu e-mail cadastrado.',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await forgot(email)

            if (response.type === 'Success') {
                setFeedback({
                    type: 'Success',
                    message: response.message || 'Instruções enviadas! Verifique sua caixa de entrada.',
                });
                setEmail('');
            } else {
                setFeedback({
                    type: 'Warning',
                    message: response.message || 'Não foi possível enviar o e-mail de recuperação.',
                });
            }
        } catch (error: any) {
            setFeedback({
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao conectar com o servidor.',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        loading,
        feedback,
        setEmail,
        handleSubmit,
    };
};