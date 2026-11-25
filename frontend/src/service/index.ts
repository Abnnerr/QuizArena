import axios, { type AxiosInstance } from "axios";


const URL = import.meta.env.NODE_MODE !== 'dev' ? import.meta.env.VITE_BACKEND_PROD : "http://localhost:9000"
export const AXIOS: AxiosInstance = axios.create({
    baseURL: `${URL}/api`,
    withCredentials: true
})


AXIOS.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            window.location.href = "/auth/login";
        }

        return Promise.reject(error);
    }
);