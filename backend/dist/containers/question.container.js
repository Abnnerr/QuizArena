import { QuestionRepository } from "../modules/question/question.repository.js";
import { QuestionService } from "../modules/question/question.service.js";
const questionRepo = new QuestionRepository();
const questionService = new QuestionService(questionRepo);
export default questionService;
//# sourceMappingURL=question.container.js.map