import React, { useState } from "react";

import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";
import type { ResponseDTO } from "../../../contexts/types/authTypes";


export function useRegister() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [showPassword, setShowPassword] = useState<boolean>(false);



    const [feedback, setFeedback] = useState<ResponseDTO | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();
        setLoading(true)

        try {
            const dados = {
                userName,
                email,
                password
            }
            console.log(dados);

            const response = await register(dados)

            if (response.type === 'Success') {
                setFeedback({
                    type: "Success",
                    message: response.message
                })
                setTimeout(() => {
                    setFeedback(null)
                    navigate('/auth/login')
                }, 2000);

            } else {
                setFeedback({
                    type: "Warning",
                    message: response.message
                })
                setTimeout(() => {
                    setFeedback(null)
                }, 2000);
            }
        } catch (error: any) {
            setFeedback({
                type: "Warning",
                message: error.message || "Erro ao registrar usuario"
            })
            setTimeout(() => {
                setFeedback(null)
            }, 2000);
        }
        finally {
            setLoading(false)
        }
    };

    return {
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        userName,
        email,
        password,
        showPassword,
        loading,
        feedback,

        setShowPassword,
        setUserName,
        setEmail,
        setPassword,
        handleSubmit,
    }
}