import type { QuestionCreateDTO } from "../dto/question.dto.js";
import type { RoomQuestion } from "@prisma/client";

export type IQuestionRepository = {
    create(dados: QuestionCreateDTO[]): Promise<number[]>;

    findQuestion(
        roomId: number,
        position: number
    ): Promise<RoomQuestion | null>;
}