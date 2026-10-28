import { io } from "../../app/server.js";
export class SocketService {
    lobby(roomCode) {
        io.to(`room:${roomCode}`).emit("room:join");
    }
    playerReady(roomCode, player_id, is_ready) {
        io.to(`room:${roomCode}`).emit("player:ready", {
            player_id,
            is_ready,
        });
    }
    // player sai do lobby e atualiza a pagina
    leaveRoom(roomCode) {
        io.to(`room:${roomCode}`).emit("room:leave");
    }
    roundStarted(roomCode) {
        io.to(`room:${roomCode}`).emit("room:start");
    }
    findQuestion(roomCode) {
        io.to(`room:${roomCode}`).emit("question:started");
    }
    roomFinished(roomCode) {
        io.to(`room:${roomCode}`).emit('room:finished');
    }
}
//# sourceMappingURL=socket.service.js.map