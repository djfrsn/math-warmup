import React, { useEffect } from 'react'
import type { MathProblem, MathProblems } from '~/types/MathTypes'
import { useFetcher } from '@remix-run/react'
import classnames from 'classnames'

// hidden input for the answer
// display the answer in a div
// animate the display element

function MathProblemUI({ data }: { data: { mathProblems: MathProblems } }) {
  const fetcher = useFetcher()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const [problemsCache, setProblemsCache] = React.useState<MathProblems>(
    data.mathProblems
  )
  const [problemData, setProblem] = React.useState<MathProblem | undefined>(
    undefined
  )
  const [answer, setAnswer] = React.useState<string | number>('')

  function onAnswerDisplayClick(
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  function validateMathProblem(problem: MathProblem, answer: number | string) {
    return problem.answer === answer
  }

  function animateAnswer() {
    if (inputRef.current) {
      inputRef.current.classList.add('animate-pulse')
      setTimeout(() => {
        inputRef.current?.classList.remove('animate-pulse')
      }, 500)
    }
  }

  function submitAnswer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    console.log('validate')
    if (problemData && validateMathProblem(problemData, answer)) {
      console.log('validated')
      setAnswer('')
      animateAnswer()
      const problems = problemsCache
      setProblemsCache(problems)
      setProblem(problems.pop())

      if (problems.length < 4) {
        fetcher.load('/math')
      }
    } else {
      // display negative feedback
    }
  }

  function _setAnswer(val: string) {
    const num = parseInt(val)

    if (!isNaN(num)) {
      const maxStrLen =
        typeof problemData?.answer === 'number'
          ? problemData?.answer.toString().length * 2
          : Infinity
      const handleStrOverflow = val.length > maxStrLen

      if (handleStrOverflow) {
        const newStr = val.slice(0, val.length - (val.length - maxStrLen) - 1)
        setAnswer(newStr + val.slice(val.length - 1, val.length))
      } else {
        setAnswer(num)
      }
    } else if (val === '') {
      setAnswer('')
    }
  }

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

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
    if (
      fetcher.type === 'done' &&
      fetcher.data.mathProblems[fetcher.data.mathProblems.length - 1] !==
        problemsCache[problemsCache.length - 1]
    ) {
      setProblemsCache([...problemsCache, ...fetcher.data.mathProblems])
    }
  }, [problemsCache, fetcher.type, fetcher.data])

  return (
    <div className="flex w-1/4 flex-col text-[128px] xl:text-[180px]">
      <div className="ml-auto">{problemData?.problem.parts.num1}</div>
      <div className="flex">
        <div>{problemData?.problem.parts.operation}</div>
        <div className="ml-auto">{problemData?.problem.parts.num2}</div>
      </div>
      <hr className="h-[5px] w-full bg-black transition-all" />
      <div
        className=" w-full text-right"
        onClick={e => onAnswerDisplayClick(e)}
      >
        {answer}
        <span className={classnames('cursor mb-[1.5rem]')}>|</span>
      </div>
      <form onSubmit={e => submitAnswer(e)} className="absolute top-[-999px]">
        <input
          ref={inputRef}
          className="col-span-3 rounded p-2 text-5xl"
          type="number"
          value={answer}
          onChange={e => _setAnswer(e.target.value)}
        />
      </form>
    </div>
  )
}

export default MathProblemUI
