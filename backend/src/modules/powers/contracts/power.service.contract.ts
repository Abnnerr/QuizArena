import type { PowerupType, PowerUpUse } from "@prisma/client";

export interface IPowerService {
    createPowerPlayers(roomId: number): Promise<void>;

    findPowerPlayer(
        playerId: string,
        roomId: number,
        namePower?: PowerupType
    ): Promise<PowerUpUse | null>;

    findPowerTarget(
        playerId: string,
        roomId: number,
        roundId: number,
        power: PowerupType
    ): Promise<PowerUpUse | null>;
}