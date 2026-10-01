import { QuestionRepository } from "../modules/question/question.repository.js";
import { QuestionService } from "../modules/question/question.service.js";

const repo = new QuestionRepository()
const service = new QuestionService(repo)



export default service