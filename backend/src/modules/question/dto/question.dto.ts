export type QuestionCreateDTO = {
    questions: {
        text: string
        alternatives: {
            text: string
            isCorrect: boolean
        }[]
    }[]
}