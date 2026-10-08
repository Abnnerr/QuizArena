import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import type { ResponseDTO } from '../../../contexts/types/authTypes';
import { useAuth } from '../../../contexts/hooks/useAuth';

export const useReset = () => {
    const navigate = useNavigate();

    const { reset } = useAuth()
    const { token } = useParams<{ token: string }>();

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<ResponseDTO | null>(null);

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const isPasswordValid = hasMinLength && hasUpper && hasLower && hasNumber && hasSpecial;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);

        if (!token) {
            setFeedback({
                type: 'Warning',
                message: 'Token de redefinição inválido ou ausente.',
            });
            return;
        }

        if (!isPasswordValid) {
            setFeedback({
                type: 'Warning',
                message: 'A senha precisa atender a todos os requisitos de segurança.',
            });
            return;
        }

        if (password !== confirmPassword) {
            setFeedback({
                type: 'Warning',
                message: 'As senhas não coincidem.',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await reset(password, token)

            if (response.type === 'Success') {
                setFeedback({
                    type: 'Success',
                    message: response.message || 'Senha alterada com sucesso! Redirecionando...',
                });

                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            } else {
                setFeedback({
                    type: 'Warning',
                    message: response.message || 'Não foi possível redefinir sua senha.',
                });
            }
        } catch (error: any) {
            setFeedback({
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao redefinir senha. O link pode ter expirado.',
            });
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
        feedback,
        handleSubmit,
    };
};