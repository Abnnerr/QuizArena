
export type AuthContextType = {
    user: any | null
    logado: boolean
    login: (dados: { userName: string, password: string }) => Promise<ResponseDTO>
    register: (dados: { userName: string, email: string, password: string }) => Promise<ResponseDTO>
    forgot: (email: string) => Promise<ResponseDTO>
    reset: (email: string, token: string) => Promise<ResponseDTO>
    profile: () => Promise<ResponseDTO>
    logOut: () => Promise<ResponseDTO>
    loading: boolean
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


export type AuthUser = {
    user_id: string;
    user_email: string;
    user_username: string;
    role_name: string;
    permissions: string[];
};
