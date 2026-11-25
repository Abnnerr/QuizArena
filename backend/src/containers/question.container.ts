import { QuestionController } from "../modules/question/question.controller.js";
import { questionService } from "./roomPlayer.container.js";


const questionController = new QuestionController(questionService)

export default questionController