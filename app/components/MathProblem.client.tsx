import React, { useEffect } from 'react'
import type { FetcherWithComponents } from '@remix-run/react'
import { useFetcher } from '@remix-run/react'
import classnames from 'classnames'
import { motion, useMotionValue } from 'framer-motion'

import type {
  CursorWidth,
  MathProblem,
  MathProblems,
} from '~/types/MathProblemTypes'
import { animateAnswer } from '~/utils/animations'

function validateMathProblem(problem: MathProblem, answer: number | string) {
  return problem.answer === answer
}

function onAnswerDisplayClick(
  e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  inputRef: React.RefObject<HTMLInputElement>
) {
  if (inputRef.current) {
    inputRef.current.focus()
  }
}

function setNextProblem({
  problemsCache,
  setProblem,
  setProblemsCache,
  fetcher,
}: {
  problemsCache: MathProblems
  setProblem: React.Dispatch<React.SetStateAction<MathProblem | undefined>>
  setProblemsCache: React.Dispatch<React.SetStateAction<MathProblems>>
  fetcher: FetcherWithComponents<any>
}) {
  const problems = problemsCache
  setProblemsCache(problems)
  const currProblem = problems.pop()
  if (currProblem) setProblem(currProblem)

  if (problems.length < 4) {
    fetcher.load('/math')
  }
}

function _setAnswer({
  val,
  problemData,
  setAnswer,
}: {
  val: string
  problemData: MathProblem | undefined
  setAnswer: React.Dispatch<React.SetStateAction<string | number>>
}) {
  const num = parseInt(val)

  if (!isNaN(num)) {
    const maxStrLen =
      typeof problemData?.answer === 'number'
        ? problemData?.answer.toString().length + 1
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

function submitAnswer({
  e,
  answer,
  answerRef,
  answerAnimationRef,
  setAnswer,
  problemData,
  problemsCache,
  setProblem,
  setProblemsCache,
  fetcher,
  cursorWidth,
}: {
  e: React.FormEvent<HTMLFormElement>
  answer: number | string
  answerRef: React.RefObject<HTMLSpanElement>
  answerAnimationRef: React.RefObject<HTMLSpanElement>
  setAnswer: React.Dispatch<React.SetStateAction<string | number>>
  problemData: MathProblem | undefined
  problemsCache: MathProblems
  setProblem: React.Dispatch<React.SetStateAction<MathProblem | undefined>>
  setProblemsCache: React.Dispatch<React.SetStateAction<MathProblems>>
  fetcher: FetcherWithComponents<any>
  cursorWidth: CursorWidth
}) {
  e.preventDefault()

  if (!answer) return

  if (problemData && validateMathProblem(problemData, answer)) {
    setAnswer('')
    animateAnswer({
      answer,
      type: 'positive',
      answerAnimationRef,
      cursorWidth,
    })
    setNextProblem({
      problemsCache,
      setProblem,
      setProblemsCache,
      fetcher,
    })
  } else {
    if (!problemData) return
    let currProblem = problemData

    if (problemData?.answerAttempts < 4) {
      currProblem = {
        ...currProblem,
        answerAttempts: problemData.answerAttempts + 1,
      }
      setProblem(currProblem)
      animateAnswer({
        answer,
        cursorWidth,
        answerRef,
        answerAnimationRef,
        problemAttempts: currProblem?.answerAttempts,
        setAnswer,
        type: 'negative',
      })

      if (currProblem.answerAttempts === 3) {
        setNextProblem({
          problemsCache,
          setProblem,
          setProblemsCache,
          fetcher,
        })
      }
    }
  }
}
// ✅ hidden input for the answer
// ✅ display the answer in a div
// animate the positive/negative feedback element
// animate change of number

function MathProblemUI({ data }: { data: { mathProblems: MathProblems } }) {
  const fetcher = useFetcher()

  const inputRef = React.useRef<HTMLInputElement>(null)
  const answerRef = React.useRef<HTMLSpanElement>(null)
  const answerAnimationRef = React.useRef<HTMLSpanElement>(null)
  const cursorRef = React.useRef<HTMLSpanElement>(null)

  const answerAnimOpacity = useMotionValue(0)

  // Animation Properties
  const [cursorWidth, setCursorWidth] = React.useState<CursorWidth>()

  // App State
  const [problemsCache, setProblemsCache] = React.useState<MathProblems>(
    data.mathProblems
  )
  const [problemData, setProblem] = React.useState<MathProblem | undefined>()
  const [answer, setAnswer] = React.useState<string | number>('')

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  useEffect(() => {
    if (cursorRef.current) {
      requestAnimationFrame(() => {
        setCursorWidth(cursorRef.current?.offsetWidth)
      })
    }
  }, [cursorRef?.current?.offsetWidth])

  useEffect(() => {
    if (!problemData && problemsCache.length === 10) {
      const problems = problemsCache
      const currProblem = problems.pop()
      setProblemsCache(problems)
      if (currProblem) setProblem({ ...(currProblem || {}), answerAttempts: 0 })
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
        className=" relative w-full text-right"
        onClick={e => onAnswerDisplayClick(e, inputRef)}
      >
        <motion.span
          className="absolute top-0"
          ref={answerAnimationRef}
          style={{ opacity: answerAnimOpacity }}
        ></motion.span>
        <span className="inline-block transition-colors" ref={answerRef}>
          {answer}
        </span>
        <span ref={cursorRef} className={classnames('cursor mb-[1.5rem]')}>
          |
        </span>
      </div>
      <form
        onSubmit={e =>
          submitAnswer({
            e,
            answer,
            answerRef,
            setAnswer,
            problemData,
            problemsCache,
            setProblem,
            setProblemsCache,
            fetcher,
            answerAnimationRef,
            cursorWidth,
          })
        }
        className="absolute top-[-999px]"
      >
        <input
          ref={inputRef}
          className="col-span-3 rounded p-2 text-5xl"
          type="number"
          value={answer}
          onChange={e =>
            _setAnswer({ val: e.target.value, problemData, setAnswer })
          }
        />
      </form>
    </div>
  )
}

export default MathProblemUI
