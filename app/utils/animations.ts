import { animate } from 'framer-motion'
import type { AnswerMotionValues } from '~/types/MathProblemTypes'
import { AnswerAnimationDelayEnum, CursorWidth } from '~/types/MathProblemTypes'

type SetAnswer = React.Dispatch<React.SetStateAction<string | number>>

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max + 1 - min) + min)
}

// Reference animation:  https://codepen.io/sol0mka/pen/eYgydO

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
  motionValues,
}: {
  answerEl: HTMLSpanElement
  answerAnimationEl: HTMLSpanElement
  problemAttempts: number
  cursorWidth: number
  answer: number | string
  setAnswer: SetAnswer
  motionValues: Record<string, AnswerMotionValues>
}) {
  console.log(problemAttempts)
  if (answerEl) {
    // after the answer is wrong n times, show the correct answer and throw it downwards
    if (problemAttempts >= 3) {
      cloneAnswer({ answerAnimationEl, cursorWidth, answer })
      // throw the answer down, make it flash red
      console.log('velocity ->')
      // TODO: do this animation for each of the numbers in the answer
      Object.keys(motionValues).forEach(motionValueKey => {
        const motionValue = motionValues[motionValueKey]
        const xDuration = 0.75
        // NOTE: a longer yDuration makes the answer fall slower
        const yDuration = xDuration + rand(1, 2)
        // NOTE: a lower gravityPull makes the answer fall faster
        const gravityPull = Math.random() * 0.5 + 0.5
        animate('#fff', '#FF0000', {
          duration: 0.1,
          onUpdate: latest => motionValue.color.set(latest),
        })
        const throwDelay = AnswerAnimationDelayEnum.Throw
        animate(1, 0, {
          duration: 2,
          delay: throwDelay,
          onUpdate: latest => {
            motionValue.opacity.set(latest)
          },
        })
        animate(1, 0, {
          duration: 4,
          delay: throwDelay,
          onUpdate: latest => {
            motionValue.scale.set(latest)
          },
        })
        const initialRotateDuration = 0.1
        animate(0, 280, {
          duration: initialRotateDuration,
          delay: throwDelay,
          onUpdate: latest => {
            motionValue.rotateZ.set(latest)
          },
        })
        animate(0, 600 + rand(50, 100), {
          duration: yDuration * 0.5,
          delay: throwDelay + initialRotateDuration,
          onUpdate: latest => {
            motionValue.rotateZ.set(latest)
          },
        })
        animate(0, 1000 + rand(750, 1000), {
          duration: xDuration,
          delay: throwDelay,
          onUpdate: latest => {
            motionValue.x.set(latest * -1)
          },
        })
        animate(0, 1000 + rand(750, 1000), {
          duration: yDuration * gravityPull,
          delay: throwDelay,
          onUpdate: latest => {
            motionValue.y.set(latest * 1.1)
          },
        })
      })
    } else {
      console.log('answerEl', answerEl)
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
  // answerAnimationEl.style.right = `${cursorWidth}px`
  // answerAnimationEl.textContent =
  //   typeof answer === 'number' ? answer.toString() : answer
}

export function animateAnswer({
  answer,
  answerRef,
  answerAnimationRef,
  problemAttempts,
  cursorWidth,
  setAnswer,
  type,
  motionValues,
}: {
  answerRef?: React.MutableRefObject<HTMLSpanElement | null>
  answerAnimationRef: React.MutableRefObject<HTMLSpanElement | null>
  cursorWidth: number | undefined
  answer: number | string
  problemAttempts?: number
  setAnswer?: SetAnswer
  type: 'positive' | 'negative'
  motionValues: Record<string, AnswerMotionValues>
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
      motionValues,
    })
  }
}
