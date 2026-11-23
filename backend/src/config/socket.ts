
import type { Server } from "socket.io";
import { roomService } from "../containers/roomPlayer.container.js"
import { roundService } from "../containers/round.container.js";



export async function socket(io: Server) {

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

            } catch (error) {
                console.error("Erro ao sair da sala:", error);
            }
        });
        socket.on("round:time_expired", async ({ roomCode, roundId }) => {
            try {

                console.log(roomCode, roundId);

                await roundService.roundExpired(roomCode, Number(roundId))
            } catch (error) {
                console.error("Erro ao sair da sala:", error);
            }
        });
        socket.on("disconnect", (reason) => {
            console.log("Usuário desconectado:", socket.id);
            console.log("Motivo:", reason);
        });
    });
}
