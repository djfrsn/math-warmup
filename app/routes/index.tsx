import { Link } from "@remix-run/react";
import MathProblem from "~/components/MathProblem";

export default function Index() {

  return (
    <main className="flex flex-col bg-blue-100 p-4 h-full">
      <div className="grid grid-cols-12 gap-4 w-full">
        <div className="col-span-3">
          <h1 className="text-3xl lg:text-4xl">
            Math Warmup
          </h1>
        </div>
        <div className="col-start-9 col-span-2">

        <Link
          to="/join"
          className="flex items-center justify-center rounded-md border border-transparent bg-sky-500 px-4 py-3 text-base font-medium text-grey-300 shadow-sm hover:bg-yellow-50 sm:px-8"
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

      <div className="mt-32 grid grid-cols-12 gap-4 w-full">
        <div className="col-span-12">
          <MathProblem />
        </div>
      </div>
    </main>
  );
}
