
import app from "./app.js";
import http from "node:http"
import { lobbyClear } from "../shared/utils/clearLobby.js";
import { socket } from '../config/socket.js';
import { Server } from "socket.io"


const PORT = process.env["PORT"]

const httpServer = http.createServer(app)
export const io = new Server(httpServer, {
    cors: {
        origin: "https://quiz-arena-zeta-ten.vercel.app",
        // origin: "http://localhost:9000",
        credentials: true
    }
})

socket(io)

httpServer.listen(PORT, () => {
    console.log(`backend rodando http://localhost:${PORT}`)
})

lobbyClear()
