import type { CursorWidth } from '~/types/MathProblemTypes'

type SetAnswer = React.Dispatch<React.SetStateAction<string | number>>

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

export function positiveFeedbackAnimation({
  answerAnimationEl,
}: {
  answerAnimationEl: HTMLSpanElement
}) {
  console.log(answerAnimationEl)
}

export function negativeFeedbackAnimation({
  answerEl,
  answerAnimationEl,
  setAnswer,
  problemAttempts,
  cursorWidth,
  answer,
}: {
  answerEl: HTMLSpanElement
  answerAnimationEl: HTMLSpanElement
  problemAttempts: number
  cursorWidth: number
  answer: number | string
  setAnswer: SetAnswer
}) {
  console.log(problemAttempts)
  if (answerEl) {
    // after the answer is wrong n times, show the correct answer and throw it downwards
    if (problemAttempts >= 3) {
      cloneAnswer({ answerAnimationEl, cursorWidth, answer })
      // throw the answer down, make it flash red
      console.log('velocity ->')
      setAnswer('')
      // setNextProblem()
      // answerAnimationEl.style.transformOrigin = 'center center'
    } else {
      if (answerEl.classList.contains('shake'))
        answerEl.classList.remove('shake')
      requestAnimationFrame(() => {
        answerEl.classList.add('shake')
      })
    }
  }
}

function cloneAnswer({
  answerAnimationEl,
  cursorWidth,
  answer,
}: {
  answerAnimationEl: HTMLSpanElement
  cursorWidth: number
  answer: number | string
}) {
  answerAnimationEl.style.visibility = 'visible'
  answerAnimationEl.style.right = `${cursorWidth}px`
  answerAnimationEl.textContent =
    typeof answer === 'number' ? answer.toString() : answer
}

export function animateAnswer({
  answer,
  answerRef,
  answerAnimationRef,
  problemAttempts,
  cursorWidth,
  setAnswer,
  type,
}: {
  answerRef?: React.MutableRefObject<HTMLSpanElement | null>
  answerAnimationRef: React.MutableRefObject<HTMLSpanElement | null>
  cursorWidth: number | undefined
  answer: number | string
  problemAttempts?: number
  setAnswer?: SetAnswer
  type: 'positive' | 'negative'
}) {
  const answerAnimationEl = answerAnimationRef.current
  const answerEl = answerRef?.current
  if (!answerEl || !answerAnimationEl || typeof cursorWidth !== 'number') return

  if (type === 'positive') {
    cloneAnswer({ answerAnimationEl, cursorWidth, answer })
    positiveFeedbackAnimation({ answerAnimationEl })
  } else if (setAnswer && typeof problemAttempts === 'number') {
    negativeFeedbackAnimation({
      answer,
      answerEl,
      answerAnimationEl,
      cursorWidth,
      setAnswer,
      problemAttempts,
    })
  }
}
