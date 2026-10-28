import { io } from "../../app/server.js";
import { prisma } from "../../db/index.js";
export function lobbyClear() {
    const interval = setInterval(async () => {
        try {
            const players = await prisma.roomPlayer.findMany({
                where: {
                    ready: false,
                    rooms: {
                        room_status: 'LOBBY',
                    }
                },
                select: {
                    room_id: true,
                    player_id: true,
                    rooms: {
                        select: {
                            room_code: true
                        }
                    }
                },
            });
            for (const player of players) {
                const result = await prisma.roomPlayer.deleteMany({
                    where: {
                        room_id: player.room_id,
                        player_id: player.player_id,
                        ready: false,
                    },
                });
                if (result.count > 0) {
                    io.to(`room:${player.rooms.room_code}`)
                        .emit("room:update");
                    io.to(`room:${player.rooms.room_code}`)
                        .emit("player:removed", {
                        playerId: player.player_id,
                    });
                }
            }
            await prisma.players.deleteMany({
                where: {
                    player_id: {
                        in: players.map(p => p.player_id)
                    }
                }
            });
        }
        catch (error) {
            console.error("Erro na limpeza do lobby:", error);
        }
    }, 120_000);
    return () => clearInterval(interval);
}
//# sourceMappingURL=clearLobby.js.map