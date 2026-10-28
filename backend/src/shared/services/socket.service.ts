import { io } from "../../app/server.js";


export class SocketService {


    lobby(roomCode: string) {
        io.to(`room:${roomCode}`).emit("room:join");
    }
    playerReady(roomCode: string, player_id: string, is_ready: boolean) {
        io.to(`room:${roomCode}`).emit("player:ready", {
            player_id,
            is_ready,
        });
    }
    // player sai do lobby e atualiza a pagina
    leaveRoom(roomCode: string) {
        io.to(`room:${roomCode}`).emit("room:leave")
    }
    
    roundStarted(roomCode: string) {
        io.to(`room:${roomCode}`).emit("room:start");
    }

    findQuestion(roomCode: string) {
        io.to(`room:${roomCode}`).emit("question:started");
    }

    roomFinished(roomCode: string) {
        io.to(`room:${roomCode}`).emit('room:finished')
    }
}