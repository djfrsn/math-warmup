import React, { useEffect } from "react"
import type { MathProblem, MathProblems } from "~/types/MathTypes";
import { useFetcher } from "@remix-run/react";


function MathProblemUI({ data }: { data: { mathProblems: MathProblems } }) {
  const fetcher = useFetcher();

  const [problemsCache, setProblemsCache] = React.useState<MathProblems>(data.mathProblems)
  const [problemData, setProblem] = React.useState<MathProblem | undefined>(undefined)
  const [answer, setAnswer] = React.useState<string | number>("")

  function validateMathProblem(problem: MathProblem, answer: number | string) {
    return problem.answer === answer
  }

  function submitAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log('validate')
    if (problemData && validateMathProblem(problemData, answer)) {
      console.log('validated')
      setAnswer('')
      const problems = problemsCache
      setProblemsCache(problems)
      setProblem(problems.pop())

      if (problems.length < 4) {
        fetcher.load('/math')
      }
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

  useEffect(() => {
    if (!problemData && problemsCache.length === 10) {
      const problems = problemsCache
      const currProblem = problems.pop()
      setProblemsCache(problems)
      setProblem(currProblem)
     }

  }, [problemData, problemsCache])

  useEffect(() => {
    // if the fetch is done and the recently loaded problems are different than the current data
    if (fetcher.type === 'done' && fetcher.data.mathProblems[fetcher.data.mathProblems.length - 1] !== problemsCache[problemsCache.length - 1]) {
      setProblemsCache([...problemsCache, ...fetcher.data.mathProblems])
    }
  }, [problemsCache, fetcher.type, fetcher.data])

  console.log('problemsCache', problemsCache)
  console.log('data', data)
  console.log('fetcher.state', fetcher.state)
  console.log('fetcher.data', fetcher.data)

  return (
    <div className="grid grid-cols-7 gap-2">
      <div className="col-span-3 text-5xl">{problemData?.problem.str}</div>
      <div className="col-span-1 text-4xl">=</div>
      <form onSubmit={(e) => submitAnswer(e)}>
        <input className="col-span-3 p-2 rounded text-5xl" type="text" value={answer} onChange={(e) => _setAnswer(e.target.value)} />
      </form>
    </div>
  )
}


export default MathProblemUI