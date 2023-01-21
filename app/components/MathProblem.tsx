import React from "react"

// Features

// Cache the problems
// 1. Generate problems on the server and store 10 problems ahead of time

// Positive/negative feedback
// 1. If the answer is correct, then the solution is displayed for n seconds in green, then the next problem is displayed
// 2. If the answer is incorrect, then the solution is cleared, the input shakes and turns red in color

// Multiple modes
// 1. challenge mode - the problem gets more difficult as the user gets more correct answers
// 2. practice mode - the problem is always the same and you can adjust the difficulty

// Leaderboards
// 1. challenge mode - the user can see their score and the top 100 scores
// 2. practice mode - the user can see their score and the top 100 scores for each difficulty

// Heat meter
// 1. show how many problems you've solved in a row without making a mistake
// 2. the faster you solve problems, the more intense the heat meter gets...show some sort of animation to convey intensity


function getRandomMathProblem(): any {
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

function validateMathProblem(problem: string, answer: number | string) {
  let _answer = answer
  if (typeof _answer === 'string') _answer = parseInt(_answer)

  const [num1, operation, num2] = problem.split(' ')
  const solution = eval(`${num1} ${operation} ${num2}`)

  return solution === answer
}

function MathProblem() {
  // everytime the problem is solve, produce another problem, randomize between division, multiplication, addition, subtraction
  // if the problem is solved, then the solution is displayed for n seconds in green, then the next problem is displayed
  // if the problem is not solved, then the solution is displayed in red, then the answer returns to the previous color
  const [problem, setProblem] = React.useState(getRandomMathProblem())
  const [answer, setAnswer] = React.useState<string | number>("")

  function submitAnswer(e: React.FormEvent<HTMLFormElement>) {
    // validate answer
    e.preventDefault()

    console.log('validate')
    if (validateMathProblem(problem, answer)) {
      console.log('validated')
      setAnswer('')
      setProblem(getRandomMathProblem())
    }
  }

  function _setAnswer(val: string) {
    const num = parseInt(val)

    if (!isNaN(num)) {
      setAnswer(num)
    } else if (val === '') {
      setAnswer('')
    }
  }

  return (
    <div className="grid grid-cols-7 gap-2">
      <div className="col-span-3 text-5xl">{problem}</div>
      <div className="col-span-1 text-4xl">=</div>
      <form onSubmit={(e) => submitAnswer(e)}>
        <input className="col-span-3 p-2 rounded text-5xl" type="text" value={answer} onChange={(e) => _setAnswer(e.target.value)} />
      </form>
    </div>
  )
}


export default MathProblem