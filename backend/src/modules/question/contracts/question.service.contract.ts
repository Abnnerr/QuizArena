import type { QuestionCreateDTO } from "../dto/question.dto.js";
import type { RoomQuestion } from "@prisma/client";

export type IQuestionService = {
    createQuestions(questions: QuestionCreateDTO[]): Promise<number[]>;

    findQuestion(
        roomId: number,
        position: number
    ): Promise<RoomQuestion>;
}