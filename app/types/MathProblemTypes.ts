import type { MotionValue } from 'framer-motion'

export interface MathProblem {
  problem: {
    str: string
    parts: { num1: number; num2: number; operation: string }
  }
  answer: number
  answerAttempts: number
}

export type MathProblems = MathProblem[]

export interface AnswerMotionValues {
  answerAnimX: MotionValue<number>
  answerAnimY: MotionValue<number>
  answerAnimScale: MotionValue<number>
  answerAnimRotateZ: MotionValue<number>
  answerAnimOpacity: MotionValue<number>
}

export type CursorWidth = number | undefined
