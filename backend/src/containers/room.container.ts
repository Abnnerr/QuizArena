import { PlayerService } from "../modules/players/player.service.js";
import { QuestionRepository } from "../modules/question/question.repository.js";
import { RoomController } from "../modules/room/room.controller.js";
import { RoomRepository } from "../modules/room/room.repository.js";
import { RoomService } from "../modules/room/room.service.js";
import { RoundRepository } from "../modules/round/round.repository.js";
import { SocketService } from "../shared/services/socket.service.js";
import playerService from "./player.container.js";

const repo = new RoomRepository()
const repoQuestion = new QuestionRepository()
export const repoRound = new RoundRepository()
const socket = new SocketService()
export const service = new RoomService(repo, repoQuestion, playerService, repoRound, socket)
const roomController = new RoomController(service)


export default roomController