import { QuestionService } from "../modules/question/question.service.js";
import { RoomRepository } from "../modules/room/room.repository.js";
import { RoomService } from "../modules/room/room.service.js";
import { RoundController } from "../modules/round/round.controller.js";
import { RoundRepository } from "../modules/round/round.repository.js";
import { RoundService } from "../modules/round/round.service.js";
import { SocketService } from "../shared/services/socket.service.js";
import questionService from "./question.container.js";
import { roomService } from "./roomPlayer.container.js";

const socket = new SocketService()
const repo = new RoundRepository()
const roundService = new RoundService(repo, roomService, questionService, socket)
const roundController = new RoundController(roundService)


export default roundController
