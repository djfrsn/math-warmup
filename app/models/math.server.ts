import type { MathProblem, MathProblems } from "~/types/MathTypes"

export function getRandomMathProblem(): MathProblem['problem'] {
  const operations = ['+', '-', '*', '/']
  const operation = operations[Math.floor(Math.random() * operations.length)]
  const num1 = Math.floor(Math.random() * 100)
  const num2 = Math.ceil(Math.random() * 10)

  // if the operation is division, then make sure the answer is a whole number
  if (operation === '/') {
    const solution = num1 / num2
    if (solution % 1 !== 0) {
      return getRandomMathProblem()
    }
  }

  // example: 10 / 10 is not allowed
  if (num1 === num2 && operation === '/') return getRandomMathProblem()
  // example: 10 - 10 is not allowed
  if (num1 === num2 && operation === '-') return getRandomMathProblem()
  // example: 8 - 19, which gives a negative number, for very hard problems this is allowed
  if (num2>num1 && operation === '-') return getRandomMathProblem()

  return {
    str: `${num1} ${operation} ${num2}`,
    parts: { num1, num2, operation }
  }
}


export function getMathProblems(): MathProblems {
  const problems = []

  for (let i = 0; i < 10; i++) {
    const problem = getRandomMathProblem()

    problems.push({ problem, answer: eval(problem.str) })
  }

  return problems
}