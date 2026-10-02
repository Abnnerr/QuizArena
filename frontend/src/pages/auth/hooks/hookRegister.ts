import React, { useState } from "react";

import { useNavigate } from "react-router";
import { AXIOS } from "../../../service";



export function useRegister() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [role, setRole] = useState<number>(1);
    const [password, setPassword] = useState<string>('');

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        try {
            const dados = {
                userName,
                email,
                role,
                password
            }
            console.log(dados);

            const { data } = await AXIOS.post('/api/auth/register', dados)
            if (data.type === 'Success') {
                navigate('/auth/login', { replace: false })
            }
        } catch (error: any) {
            console.log(error.message)
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
        role,
        password,
        showPassword,

        setShowPassword,
        setUserName,
        setEmail,
        setRole,
        setPassword,
        handleSubmit,
    }
}