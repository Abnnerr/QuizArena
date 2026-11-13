import { io } from "socket.io-client";

export const socket = io(
    "https://quizarena-api-ytz7.onrender.com/",
    {
        autoConnect: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    }
);