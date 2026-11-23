import { QuestionController } from "../modules/question/question.controller.js";
import { QuestionRepository } from "../modules/question/question.repository.js";
import { QuestionService } from "../modules/question/question.service.js";
import { roomService } from "./roomPlayer.container.js";

const questionRepo = new QuestionRepository()
export const questionService = new QuestionService(questionRepo, roomService)
const questionController = new QuestionController(questionService)

export default questionController