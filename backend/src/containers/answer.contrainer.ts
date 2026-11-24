import { AnswerController } from "../modules/answers/answer.controller.js";
import { AnswerService } from "../modules/answers/answer.service.js";
import { AnswerRepository } from "../modules/answers/answer.repository.js";
import { roomService } from "./roomPlayer.container.js";
import { roundService } from "./round.container.js";
import powerService from "./power.contrainer.js";
import { SocketService } from "../shared/services/socket.service.js";

const answerRepo = new AnswerRepository()
const socket = new SocketService()
const answerService = new AnswerService(answerRepo,roomService,roundService, powerService, socket)
const answerController = new AnswerController(answerService)

export default answerController