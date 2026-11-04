export class ScoreNormal {
    calculate(remainingSeconds: number, timeLimit: number): number {
        return Math.ceil(900 * remainingSeconds / timeLimit);
    }
}