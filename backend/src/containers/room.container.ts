import { QuestionRepository } from "../modules/question/question.repository.js";
import { RoomController } from "../modules/room/room.controller.js";
import { RoomRepository } from "../modules/room/room.repository.js";
import { RoomService } from "../modules/room/room.service.js";
import { RoundRepository } from "../modules/round/round.repository.js";

const repo = new RoomRepository()
const repoQuestion = new QuestionRepository()
const repoRound = new RoundRepository()
const service = new RoomService(repo, repoQuestion, repoRound)
const roomController = new RoomController(service)


export default roomController