import { AnswerController } from "../modules/answers/answer.controller.js";
import { AnswerService } from "../modules/answers/answer.service.js";
import { AnswerRepository } from "../modules/answers/answer.repository.js";
import { playerService, roomService } from "./roomPlayer.container.js";
import { roundService } from "./round.container.js";
import powerService from "./power.contrainer.js";

const answerRepo = new AnswerRepository()
const answerService = new AnswerService(answerRepo,roomService,roundService, powerService, playerService)
const answerController = new AnswerController(answerService)

export default answerController