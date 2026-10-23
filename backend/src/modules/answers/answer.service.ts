import type { AnswerRepository } from "./answers.repository.js";

export class AnswerService {
    constructor(
        private readonly repo: AnswerRepository
    ) { }

   
}