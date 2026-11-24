
import type { Server } from "socket.io";

let io: Server | null = null;

export function configureSocketService(server: Server) {
    io = server;
}

export class SocketService {

    private get server(): Server {
        if (!io) {
            throw new Error("Socket.IO ainda não foi inicializado.");
        }

        return io;
    }

    lobby(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("room:join");
    }

    playerReady(roomCode: string, player_id: string, is_ready: boolean) {
        this.server.to(`room:${roomCode}`).emit("player:ready", {
            player_id,
            is_ready,
        });
    }

    leaveRoom(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("room:leave");
    }

    roundStarted(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("room:start");
    }

    findQuestion(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("question:started");
    }

    roomFinished(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("room:finished");
    }

    powerFifty(roomCode: string, alternatives: any, playerId: string) {
        this.server.to(`room:${roomCode}`).emit("room:powerfifty", {
            playerId,
            alternatives,
        });
    }

    powerSkipTurn(roomCode: string, skiped: boolean, target: string, userName: string) {
        this.server.to(`room:${roomCode}`).emit("room:skip", {
            target,
            skiped,
            userName,
        });
    }

    roundExpired(roomCode: string, alternative: any) {
        this.server.to(`room:${roomCode}`).emit("room:expired", {
            alternative,
        });
    }

    updateAnswered(roomCode: string) {
        this.server.to(`room:${roomCode}`).emit("room:answered")
    }
}
