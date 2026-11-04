import { AppError } from "../../../error/AppError.js";
import { ScoreHardcore } from "./strategies/hardcore.strategy.js";
import { ScoreNormal } from "./strategies/normal.strategy.js";

export class ScoreFactory {
    static execute(mode: string) {
        switch (mode) {
            case "NORMAL":
                return new ScoreNormal()

            case "HARDCORE":
                return new ScoreHardcore()
            default:
                throw new AppError(400, 'modo de jogo invalido')
        }
    }
}