import axios, { type AxiosInstance } from "axios";

export const AXIOS: AxiosInstance = axios.create({
    baseURL: "https://quizarena-api-ytz7.onrender.com/api",
    withCredentials: true
})