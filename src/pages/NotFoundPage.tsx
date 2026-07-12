import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-6 text-center">
      <div>
        <p className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-7xl font-black text-transparent">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-950 dark:text-white">
          Page not found
        </h1>

        <p className="mt-2 text-slate-600 dark:text-slate-400">
          The page you are looking for does not exist.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-2xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
        >
          Return home
        </Link>
      </div>
    </section>
  );
}
