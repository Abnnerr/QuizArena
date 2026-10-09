import { createContext, useEffect, useState } from "react";
import { AXIOS } from "../service";
import type { AuthContextType, ResponseDTO } from "./types/authTypes";

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<any | null>(null)
    const [logado, setLogado] = useState<boolean>(false)

    useEffect(() => {
        (async () => {
            try {
                const { data } = await AXIOS.get('/auth/me')
                if (data.type === 'Success') {
                    console.log(data);
                    
                    setUser(data.data)
                    setLogado(true)
                }
            } catch (error) {

            }
        })()
    }, [])


    async function register(dados: { userName: string; email: string; role: number; password: string }): Promise<ResponseDTO> {
        try {
            const { data } = await AXIOS.post<ResponseDTO>('/auth/register', dados);

            if (data.type === 'Warning') {
                return {
                    type: 'Warning',
                    message: data.message || 'Não foi possível criar sua conta. Verifique os dados.',
                };
            }

            return {
                type: 'Success',
                message: 'Conta criada com sucesso! Bem-vindo à arena.',
            };
        } catch (error: any) {
            return {
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao registrar usuário. Tente novamente mais tarde.',
            };
        }
    }

    async function login(dados: { userName: string; password: string }): Promise<ResponseDTO> {
        try {
            const { data } = await AXIOS.post<ResponseDTO>('/auth/login', dados);

            if (data.type === 'Success') {
                setUser(data.data.user);
                setLogado(true);

                return {
                    type: 'Success',
                    message: 'Login realizado com sucesso! Entrando na arena...',
                };
            }

            return {
                type: 'Warning',
                message: data.message || 'Usuário ou senha incorretos.',
            };
        } catch (error: any) {
            return {
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao conectar. Verifique suas credenciais.',
            };
        }
    }

    async function forgot(email: string): Promise<ResponseDTO> {
        try {
            const { data } = await AXIOS.post<ResponseDTO>('/auth/forgot-password', { email });

            if (data.type === 'Warning') {
                return {
                    type: 'Warning',
                    message: data.message || 'Não foi possível processar a solicitação para este e-mail.',
                };
            }

            return {
                type: 'Success',
                message: 'Instruções de recuperação enviadas! Verifique sua caixa de entrada.',
            };
        } catch (error: any) {
            return {
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao solicitar recuperação de conta. Tente novamente.',
            };
        }
    }

    async function reset(password: string, token: string): Promise<ResponseDTO> {
        try {
            const { data } = await AXIOS.post<ResponseDTO>(`/auth/reset-password/${token}`, { password });

            if (data.type === 'Warning') {
                return {
                    type: 'Warning',
                    message: data.message || 'Não foi possível redefinir a senha. O token pode ser inválido.',
                };
            }

            return {
                type: 'Success',
                message: 'Sua senha foi redefinida com sucesso! Você já pode fazer login.',
            };
        } catch (error: any) {
            return {
                type: 'Warning',
                message: error.response?.data?.message || 'Erro ao redefinir a senha. O link pode ter expirado.',
            };
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            logado,
            login,
            register,
            forgot,
            reset
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;