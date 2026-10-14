import { PlayerRepository } from "../modules/players/player.repository.js";
import { PlayerService } from "../modules/players/player.service.js";

const repo = new PlayerRepository()
const playerService = new PlayerService(repo)

export default playerService