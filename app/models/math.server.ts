export function getRandomMathProblem(): any {
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

  if (num1 === num2 && operation === '/') return getRandomMathProblem()

  if (num1 === num2 && operation === '-') return getRandomMathProblem()

  if (num2>num1 && operation === '-') return getRandomMathProblem()

  return `${num1} ${operation} ${num2}`
}