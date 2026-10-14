import { Server } from "socket.io";
import app from "./app.js";
import http from "node:http"
import { PlayerRepository } from "../modules/players/player.repository.js";
import playerService from "../containers/player.container.js";
import { RoomService } from "../modules/room/room.service.js";
import { service } from "../containers/room.container.js";
import { lobbyClear } from "../shared/utils/clearLobby.js";

const PORT = process.env.PORT

const httpServer = http.createServer(app)

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

            await service.leave(playerId, roomCode)

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
