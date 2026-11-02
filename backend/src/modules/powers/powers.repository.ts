import type { PowerupType } from "@prisma/client";
import { prisma } from "../../db/index.js"

export class PowerRepository {


    async powerPlayers(ids: string[], roomId: number) {
        try {

            const powerups = await prisma.powerUp.findMany({
                select: {
                    powerup_id: true
                }
            });
            return await prisma.powerUpUse.createMany({
                data: ids.flatMap((playerId) =>
                    powerups.map((power) => ({
                        player_id: playerId,
                        room_id: roomId,
                        powerup_id: power.powerup_id
                    }))
                )
            });
        } catch (error) {
            throw error
        }
    }

    async findPowerById(id: number) {
        try {
            return await prisma.powerUp.findUnique({
                where: {
                    powerup_id: id
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findPowerPlayer(playerId: string, roomId: number, namePower?: PowerupType) {
        try {
            return await prisma.powerUpUse.findFirst({
                where: {
                    player_id: playerId,
                    room_id: roomId,
                    ...(namePower && {
                        powerup: {
                            powerup_type: namePower
                        }
                    })
                }
            });
        } catch (error) {
            throw error
        }
    }
    async updatePower(playerId: string, roomId: number, powerId: number, position?: number, roundId?: number, targetPlayer?: string) {
        try {
            return await prisma.powerUpUse.update({
                where: {
                    room_id_player_id_powerup_id: {
                        powerup_id: powerId,
                        player_id: playerId,
                        room_id: roomId
                    }
                }, data: {
                    used: true,
                    ...(targetPlayer && { player_target: targetPlayer }),
                    ...(roundId && { round_id: roundId }),
                    ...(position && { position: position })
                }
            })
        } catch (error) {
            throw error
        }
    }
    async findPowerTarget(playerId: string, roomId: number, roundId: number) {
        try {

            console.log(playerId, roomId, roundId);

            return await prisma.powerUpUse.findMany({
                where: {
                    player_target: playerId,
                    room_id: roomId,
                    round_id: roundId,
                    used: true,
                    powerup: {
                        is: {
                            powerup_type: 'SKIP_TURN'
                        }
                    }
                },
            })
        } catch (error) {
            throw error
        }
    }
}