import { io } from "socket.io-client";
const URL = import.meta.env.NODE_MODE !== 'dev' ? import.meta.env.VITE_BACKEND_PROD : import.meta.env.VITE_BACKEND_DEV

export const socket = io(
    URL,
    {
        autoConnect: false,
        transports: ["websocket", "polling"],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
    }
);
