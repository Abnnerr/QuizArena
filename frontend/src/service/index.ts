import axios, { type AxiosInstance } from "axios";
const URL = import.meta.env.NODE_MODE !== 'dev'? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV
export const AXIOS: AxiosInstance = axios.create({
    baseURL: `${URL}/api`,
    withCredentials: true
})