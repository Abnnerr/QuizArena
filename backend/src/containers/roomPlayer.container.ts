
import { PlayerController } from "../modules/players/player.controller.js";
import { PlayerRepository } from "../modules/players/player.repository.js";
import { PlayerService } from "../modules/players/player.service.js";

import { QuestionRepository } from "../modules/question/question.repository.js";
import { QuestionService } from "../modules/question/question.service.js";

import { RoomController } from "../modules/room/room.controller.js";
import { RoomRepository } from "../modules/room/room.repository.js";
import { RoomService } from "../modules/room/room.service.js";

import { RoundRepository } from "../modules/round/round.repository.js";
import { SocketService } from "../shared/services/socket.service.js";

import powerService, { powerRepo } from "./power.contrainer.js";

const socket = new SocketService();

// Repositories
const playerRepo = new PlayerRepository();
const roomRepo = new RoomRepository();
const questionRepo = new QuestionRepository();
const repoRound = new RoundRepository();

// Services
const questionService = new QuestionService(questionRepo);

const playerService = new PlayerService(
    playerRepo,
    powerRepo,
    repoRound,
    socket
);

const roomService = new RoomService(
    roomRepo,
    questionService,
    powerService,
    repoRound,
    socket
);

// Resolver dependências circulares
questionService.setRoomService(roomService);
playerService.setRoomService(roomService);
roomService.setPlayerService(playerService);

// Controllers
const playerController = new PlayerController(playerService);
const roomController = new RoomController(roomService);

export {
    playerService,
    roomService,
    playerController,
    roomController,
    repoRound,
};

export default {
    playerController,
    roomController,
};
