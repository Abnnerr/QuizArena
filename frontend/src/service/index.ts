import axios, { type AxiosInstance } from "axios";


const URL = import.meta.env.NODE_MODE !== 'dev' ? import.meta.env.VITE_BACKEND_PROD : "http://localhost:9000"
export const AXIOS: AxiosInstance = axios.create({
    baseURL: `${URL}/api`,
    withCredentials: true
})

AXIOS.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url ?? "";

        const publicRoutes = [
            "/auth/login",
            "/auth/register",
            "/auth/forgot",
            "/auth/reset",
        ];

        const isPublicRoute = publicRoutes.some((route) =>
            url.includes(route)
        );

        if (
            status === 401 &&
            !isPublicRoute &&
            window.location.pathname !== "/auth/login"
        ) {
            window.location.replace("/auth/login");
        }

        return Promise.reject(error);
    }
);