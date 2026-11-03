import type { PowerUpContext } from "../../dto/player.dto.js"

export async function skipTurn(dados: PowerUpContext) {
    await dados.repoPower.updatePower(
        dados.playerId,
        dados.roomId,
        dados.powerId,
        undefined,
        dados.roundId,
        dados.targetPlayerId
    )

    dados.socket.powerSkipTurn(dados.code, true, dados.targetPlayerId!)
}