
import type { RoomQuestion } from "@prisma/client";
import type { CreateQuestionDTO } from "../schema/createQuestion.js";
import type { AuthPayload } from "../../../types/generic.js";
import type { UpdateQuestionDTO } from "../schema/updateQuestion.js";

export type IQuestionService = {
    createQuestion(question: CreateQuestionDTO, user: AuthPayload): Promise<number>;
    findQuestion(roomId: number, position?: number): Promise<RoomQuestion>;
    updateQuestion(questionId: number, question: UpdateQuestionDTO, userId: string): Promise<void>
    deleteQuestion(questionId: number, userId: string): Promise<void>
    deleteQuestionRoom(roomId: number, questionId: number, userId: string): Promise<void>
    addToRoom(roomId: number, questionId: number, userId: string): Promise<void>
}