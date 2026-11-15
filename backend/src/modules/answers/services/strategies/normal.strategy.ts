export class ScoreNormal {
    calculate(remainingSeconds: number, timeLimit: number): number {
        return Math.ceil(200 * remainingSeconds / timeLimit);
    }
}