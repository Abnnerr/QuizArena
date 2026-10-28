
import app from "./app.js";
import http from "node:http"
import { lobbyClear } from "../shared/utils/clearLobby.js";
import { Server } from "socket.io";
import { roomService } from "../containers/roomPlayer.container.js";


const PORT = process.env["PORT"]

export const httpServer = http.createServer(app)

export const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
})
io.on("connection", (socket) => {
    console.log("Usuário conectado:", socket.id);

    socket.on("room:join", (roomCode: string) => {
        socket.join(`room:${roomCode}`);

        console.log(
            `Socket ${socket.id} entrou na sala room:${roomCode}`
        );
    });

    socket.on("player:leave", async ({ roomCode, playerId }) => {
        try {

            await roomService.leaveRoom(playerId, roomCode)

            socket.leave(`room:${roomCode}`);

            io.to(`room:${roomCode}`).emit("room:update");
        } catch (error) {
            console.error("Erro ao sair da sala:", error);
        }
    });
    socket.on("disconnect", (reason) => {
        console.log("Usuário desconectado:", socket.id);
        console.log("Motivo:", reason);
    });
});


httpServer.listen(PORT, () => {
    console.log(`backend rodando http://localhost:${PORT}`)
})

lobbyClear()
