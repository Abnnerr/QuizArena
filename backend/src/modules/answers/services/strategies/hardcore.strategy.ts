export class ScoreHardcore {
    calculate(remainingSeconds: number, timeLimit: number): number {
        return Math.ceil(100 * remainingSeconds / timeLimit);
    }
}
