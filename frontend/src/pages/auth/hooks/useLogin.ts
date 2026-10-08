import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../contexts/hooks/useAuth";

export function useLogin() {
    const navigate = useNavigate()
    const {
        login
    } = useAuth()
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
        e.preventDefault();

        try {
            const dados = {
                userName,
                password
            }
            const response = await login(dados)

            if (response.type === 'Success') {
                navigate('/')
            }
        } catch (error) {

        }
    };

    return {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit
    }
}