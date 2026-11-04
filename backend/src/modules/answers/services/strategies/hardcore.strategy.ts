export class ScoreHarcode {
    calculate(remainingSeconds: number, timeLimit: number): number {
        return Math.ceil(500 * remainingSeconds / timeLimit);
    }
}
