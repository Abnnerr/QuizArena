
export type AuthContextType = {
    user: any | null
    logado: boolean
    login: (dados: { userName: string, password: string }) => Promise<ResponseDTO>
    register: (dados: { userName: string, email: string, role: number, password: string }) => Promise<ResponseDTO>
    forgot: (email: string) => Promise<ResponseDTO>
    reset: (email: string, token: string) => Promise<ResponseDTO>
}

export type User = {
    id: string,

}

export type ResponseDTO = {
    type: "Success" | "Warning"
    message: string,
    data?: any
    error?: any
}
