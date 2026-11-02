import { PlayerRepository } from "../modules/players/player.repository.js";
import { PowerRepository } from "../modules/powers/powers.repository.js";
import { PowerService } from "../modules/powers/powers.service.js";


export const powerRepo = new PowerRepository()
const playerRepo = new PlayerRepository()
const powerService = new PowerService(powerRepo, playerRepo)


export default powerService