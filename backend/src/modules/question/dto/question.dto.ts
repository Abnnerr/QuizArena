export type QuestionCreateDTO = {
    text: string
    alternatives: {
        text: string
        isCorrect: boolean
    }[]
}