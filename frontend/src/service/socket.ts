import { io } from "socket.io-client";

export const socket = io(
    "http://localhost:9000",
    {
        autoConnect: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    }
);