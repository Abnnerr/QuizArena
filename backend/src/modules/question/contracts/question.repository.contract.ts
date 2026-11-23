
import type { Questions, RoomQuestion } from "@prisma/client";
import type { CreateQuestionDTO } from "../schema/createQuestion.js";
import type { UpdateQuestionDTO } from "../schema/updateQuestion.js";

export type IQuestionRepository = {
    create(dados: CreateQuestionDTO, userId: string): Promise<number>;
    // findQuestions(roomId: number): Promise<RoomQuestion[]>
    findQuestion(
        roomId: number,
        position?: number
    ): Promise<RoomQuestion | null>;
    updateQuestion(questionId: number, question: UpdateQuestionDTO, userId: string): Promise<void>
    deleteQuestion(questionId: number): Promise<void>
    deleteQuestionRoom(roomId: number, questionId: number): Promise<void>
    findQuestionById(questionId: number): Promise<Questions | null>
    addtoRoom(roomId: number, questionId: number): Promise<any>
}