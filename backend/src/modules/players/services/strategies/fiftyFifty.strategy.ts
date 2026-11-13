import type { PowerUpContext } from "../../dto/player.dto.js";

export async function fiftyFifty(dados: PowerUpContext) {
    const [, alternatives] = await Promise.all([
        await dados.repoPower.updatePower(
            dados.playerId,
            dados.roomId,
            dados.powerId,
        ),
        await dados.roomService.findAlternativesIncorret(dados.questionId)
    ])

    dados.socket.powerFifty(dados.code, alternatives, dados.playerId)
}