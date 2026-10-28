import { prisma } from "../../db/index.js";
export class PlayerRepository {
    async countPlayers(id) {
        try {
            return await prisma.roomPlayer.count({
                where: {
                    room_id: id
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async create(name) {
        try {
            return await prisma.players.create({
                data: {
                    player_name: name
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findPlayerRoom(id, roomId) {
        try {
            return await prisma.roomPlayer.findUnique({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findPlayer(name) {
        try {
            return await prisma.players.findUnique({
                where: {
                    player_name: name
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async findPlayers(roomId) {
        try {
            return await prisma.roomPlayer.findMany({
                where: {
                    room_id: roomId,
                },
                include: {
                    players: {
                        select: {
                            player_name: true
                        }
                    }
                },
                orderBy: {
                    score: 'desc'
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async readyPlayer(id, roomId, ready) {
        try {
            return await prisma.roomPlayer.update({
                where: {
                    room_id_player_id: {
                        player_id: id,
                        room_id: roomId
                    }
                },
                data: {
                    ready
                }
            });
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }
    async playerScore(player_id) {
        try {
            return await prisma.roomPlayer.findFirst({
                where: {
                    player_id
                }, select: {
                    score: true
                }
            });
        }
        catch (error) {
        }
    }
    async updatePlayerScore(roomId, playerId, score) {
        try {
            await prisma.roomPlayer.update({
                where: {
                    room_id_player_id: {
                        player_id: playerId,
                        room_id: roomId
                    }
                },
                data: {
                    score
                }
            });
        }
        catch (error) {
            throw error;
        }
    }
    async deletePlayer(id) {
        try {
            await prisma.players.delete({
                where: {
                    player_id: id
                }
            });
        }
        catch (error) {
        }
    }
}
//# sourceMappingURL=player.repository.js.map