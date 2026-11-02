import { io } from "socket.io-client";

export const socket = io(
    "https://quizarena-api-ytz7.onrender.com",
    {
        autoConnect: false,
        withCredentials: true,
    }
);