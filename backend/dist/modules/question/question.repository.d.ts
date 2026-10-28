import type { QuestionCreateDTO } from "./dto/question.dto.js";
export declare class QuestionRepository {
    create(dados: QuestionCreateDTO[]): Promise<number[]>;
    findQuestion(roomId: number, position: number): Promise<any>;
}
//# sourceMappingURL=question.repository.d.ts.map