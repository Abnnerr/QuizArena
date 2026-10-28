import { AppError } from "../../error/AppError.js";
export class QuestionService {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async createQuestions(questions) {
        try {
            const someAlternative = questions.some(item => item.alternatives.length > 4);
            const someQuestion = questions.length < 3;
            if (someQuestion) {
                throw new AppError(400, "perguntas com menos de 3");
            }
            if (someAlternative) {
                throw new AppError(400, 'alguma pergunta tem mais de 4 alternativas');
            }
            const questionIds = await this.repo.create(questions);
            return questionIds;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'erro ao criar questions');
        }
    }
    async findQuestion(roomId, position) {
        try {
            const question = await this.repo.findQuestion(roomId, position);
            return question;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'erro ao criar questions');
        }
    }
}
//# sourceMappingURL=question.service.js.map