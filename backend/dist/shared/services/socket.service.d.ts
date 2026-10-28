export declare class SocketService {
    lobby(roomCode: string): void;
    playerReady(roomCode: string, player_id: string, is_ready: boolean): void;
    leaveRoom(roomCode: string): void;
    roundStarted(roomCode: string): void;
    findQuestion(roomCode: string): void;
    roomFinished(roomCode: string): void;
}
//# sourceMappingURL=socket.service.d.ts.map