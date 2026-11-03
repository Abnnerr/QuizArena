import { AppError } from "../../../error/AppError.js";
import type { PowerUpStrategy } from "../dto/player.dto.js";
import { doubleXp } from "./strategys/doubleXp.strategy.js";
import { fiftyFifty } from "./strategys/fiftyFifty.strategy.js";
import { skipTurn } from "./strategys/skipTurn.strategy.js";

export class PowerUpFactory {
    static execute(value: string): PowerUpStrategy{
        switch (value) {
            case "DOUBLE_XP":
                return doubleXp

            case "FIFTY_FIFTY":
                return fiftyFifty

            case "SKIP_TURN":
                return skipTurn
            default:
                throw new AppError(400, 'PowerUp invalido')
        }
    }
}