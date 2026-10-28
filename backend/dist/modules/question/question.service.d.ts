import type { QuestionCreateDTO } from "./dto/question.dto.js";
import type { QuestionRepository } from "./question.repository.js";
export declare class QuestionService {
    private readonly repo;
    constructor(repo: QuestionRepository);
    createQuestions(questions: QuestionCreateDTO[]): Promise<number[]>;
    findQuestion(roomId: number, position: number): Promise<any>;
}
//# sourceMappingURL=question.service.d.ts.map