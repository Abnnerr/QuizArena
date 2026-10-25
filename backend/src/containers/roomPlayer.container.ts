import { AnswerRepository } from "../modules/answers/answers.repository.js";
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

const socket = new SocketService();

const playerRepo = new PlayerRepository();
const roomRepo = new RoomRepository();
const questionRepo = new QuestionRepository();
const repoRound = new RoundRepository();
const repoAnswer = new AnswerRepository();

const questionService = new QuestionService(questionRepo);

// Criar os serviços sem as dependências circulares no construtor
const playerService = new PlayerService(playerRepo, socket);
const roomService = new RoomService(
    roomRepo,
    questionService,
    repoRound,
    repoAnswer,
    socket
);

// Conectar os serviços
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