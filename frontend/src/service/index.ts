import axios, { type AxiosInstance } from "axios";
import { useNavigate } from "react-router";
const URL = import.meta.env.NODE_MODE !== 'dev' ? import.meta.env.VITE_BACKEND_PROD : "http://localhost:9000"
export const AXIOS: AxiosInstance = axios.create({
    baseURL: `${URL}/api`,
    withCredentials: true
})


AXIOS.interceptors.response.use(
    (response) => response,
    (error) => {
        const navigate = useNavigate()
        if (error.response?.status === 401) {
            navigate('/auth/login')
        }

        return Promise.reject(error);
    }
);