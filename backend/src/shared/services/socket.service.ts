import { io } from "../../app/server.js";

export class SocketService {
    roundStarted(roomId: number, data: any) {
        io.to(`room:${roomId}`).emit("round_started", data)
    }
}