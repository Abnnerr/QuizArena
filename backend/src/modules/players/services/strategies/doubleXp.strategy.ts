import type { PowerUpContext } from "../../dto/player.dto.js";

export async function doubleXp(dados: PowerUpContext) {
    await dados.repoPower.updatePower(
        dados.playerId,
        dados.roomId,
        dados.powerId,
        dados.position
    )
}