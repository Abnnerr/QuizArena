import { AppError } from "../../error/AppError.js";
export class PlayerService {
    repo;
    socket;
    roomService;
    constructor(repo, socket) {
        this.repo = repo;
        this.socket = socket;
    }
    setRoomService(roomService) {
        this.roomService = roomService;
    }
    async countPlayers(roomId) {
        try {
            const players = await this.repo.countPlayers(roomId);
            return players;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao contar players');
        }
    }
    async createPlayer(name) {
        try {
            let player = await this.repo.findPlayer(name);
            if (player) {
                throw new AppError(409, "Esse nome já está em uso");
            }
            return await this.repo.create(name);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar player');
        }
    }
    async findPlayerRoom(id, roomId) {
        try {
            const player = await this.repo.findPlayerRoom(id, roomId);
            if (player) {
                throw new AppError(400, 'player ja esta na sala');
            }
            return player;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar player');
        }
    }
    //player fica pronto ou nao
    async readyPlayer(playerId, roomCode, ready) {
        try {
            console.log(playerId, roomCode, ready);
            const room = await this.roomService.findRoom(roomCode);
            const isReady = await this.repo.readyPlayer(playerId, room.room_id, ready);
            if (!isReady) {
                throw new AppError(400, 'Erro ao player ficar pronto');
            }
            this.socket.playerReady(room?.room_code, isReady.player_id, isReady.ready);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao ready player');
        }
    }
    async updatePlayerScore(roomId, playerId, scores) {
        try {
            const playerScore = await this.repo.playerScore(playerId);
            scores += playerScore?.score + scores;
            await this.repo.updatePlayerScore(roomId, playerId, scores);
        }
        catch (error) {
        }
    }
    async deletePlayer(id) {
        try {
            await this.repo.deletePlayer(id);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar player');
        }
    }
    async findPodium(code) {
        try {
            const room = await this.roomService.findRoom(code);
            const players = await this.repo.findPlayers(room.room_id);
            return players;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar player');
        }
    }
}
//# sourceMappingURL=player.service.js.map