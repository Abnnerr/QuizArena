
import app from "./app.js";
import http from "node:http";
import { lobbyClear } from "../shared/utils/clearLobby.js";
import { socket } from "../config/socket.js";
import { Server } from "socket.io";
import { configureSocketService } from "../shared/services/socket.service.js";

const URL = process.env["NODE_MODE"] !== 'dev' ? process.env["URL_FRONT_PROD"] : process.env["URL_FRONT_DEV"]

const PORT = process.env["PORT"];

const httpServer = http.createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: URL,
        credentials: true,
    },
});

configureSocketService(io);

socket(io);

httpServer.listen(PORT, () => {
    console.log(`backend rodando http://localhost:${PORT}`);
    console.log(`swagger http://localhost:${PORT}/api-docs`);
});

lobbyClear();
