
import type {
    PowerUp,
    PowerupType,
    PowerUpUse
} from "@prisma/client";


export type IPowerRepository = {
    powerPlayers(
        ids: string[],
        roomId: number
    ): Promise<{ count: number }>;

    findPowerById(id: number): Promise<PowerUp | null>;

    findPowerPlayer(
        playerId: string,
        roomId: number,
        namePower?: PowerupType
    ): Promise<PowerUpUse | null>;

    updatePower(
        playerId: string,
        roomId: number,
        powerId: number,
        position?: number,
        roundId?: number,
        targetPlayer?: string
    ): Promise<PowerUpUse>;

    findPowerTarget(
        playerId: string,
        roomId: number,
        roundId: number,
        power: PowerupType
    ): Promise<PowerUpUse | null>;
}
