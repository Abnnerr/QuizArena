import type { PowerUpContext } from "../../dto/player.dto.js";

export async function fiftyFifty(dados: PowerUpContext) {
    await dados.repoPower.updatePower(
        dados.playerId,
        dados.roomId,
        dados.powerId,
    )
    const alternatives = await dados.roomService.findAlternativesIncorret(dados.questionId)

    console.log(alternatives);

    dados.socket.powerFifty(dados.code, alternatives, dados.playerId)
}