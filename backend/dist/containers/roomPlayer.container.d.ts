import { PlayerController } from "../modules/players/player.controller.js";
import { PlayerService } from "../modules/players/player.service.js";
import { RoomController } from "../modules/room/room.controller.js";
import { RoomService } from "../modules/room/room.service.js";
import { RoundRepository } from "../modules/round/round.repository.js";
declare const repoRound: RoundRepository;
declare const playerService: PlayerService;
declare const roomService: RoomService;
declare const playerController: PlayerController;
declare const roomController: RoomController;
export { playerService, roomService, playerController, roomController, repoRound, };
declare const _default: {
    playerController: PlayerController;
    roomController: RoomController;
};
export default _default;
//# sourceMappingURL=roomPlayer.container.d.ts.map