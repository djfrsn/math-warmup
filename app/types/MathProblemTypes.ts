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
  x: MotionValue<number>
  y: MotionValue<number>
  color: MotionValue<string>
  scale: MotionValue<number>
  rotateZ: MotionValue<number>
  opacity: MotionValue<number>
}

export enum AnswerAnimationDelayEnum {
  Throw = 0.5,
}

export type CursorWidth = number | undefined
