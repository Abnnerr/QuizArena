import { useState } from "react";
import AXIOS from "../service";
import { useNavigate } from "react-router";

export function useRegister() {
    const navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState(1);
    const [password, setPassword] = useState('');

    const hasMinLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    async function handleSubmit(e) {
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
        } catch (error) {
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