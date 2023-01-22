
export interface MathProblem {
  problem: { str: string, parts: { num1: number, num2: number, operation: string } }
  answer: number
}

export type MathProblems = MathProblem[]