import { io } from "socket.io-client";

export const socket = io(
    "https://quizarena1.onrender.com",
    {
        autoConnect: false,
        withCredentials: true,
    }
);