import type { QuestionRepository } from "./question.repository.js";

export class QuestionService {
    constructor(private readonly repo: QuestionRepository) { }
}