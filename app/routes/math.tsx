import { Link, useLoaderData } from '@remix-run/react'
import MathProblem from '~/components/MathProblem.client'
import { getMathProblems } from '~/models/math.server'

export const loader = async () => {
  const mathProblems = getMathProblems()

  return { mathProblems }
}

export default function Index() {
  const data = useLoaderData<typeof loader>()

  return (
    <main className="flex h-full flex-col bg-blue-100 p-4">
      <div className="grid w-full grid-cols-12 gap-4">
        <div className="col-span-3">
          <h1 className="text-3xl lg:text-4xl">Math Warmup</h1>
        </div>
        <div className="col-span-2 col-start-9">
          <Link
            to="/join"
            className="text-grey-300 flex items-center justify-center rounded-md border border-transparent bg-sky-500 px-4 py-3 text-base font-medium shadow-sm hover:bg-yellow-50 sm:px-8"
          >
            Sign up
          </Link>
        </div>
        <div className="col-span-2">
          <Link
            to="/login"
            className="flex items-center justify-center rounded-md bg-teal-500 px-4 py-3 font-medium text-white hover:bg-yellow-600"
          >
            Log In
          </Link>
        </div>
      </div>

      <div className="mt-32 grid w-full grid-cols-12 gap-4">
        <div className="col-span-12">
          <MathProblem data={data} />
        </div>
      </div>
    </main>
  )
}
