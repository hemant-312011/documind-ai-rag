import { BrainCircuit, Code2, ExternalLink, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = [
  { label: "Home", path: "/" },
  { label: "Upload", path: "/upload" },
  { label: "Chat", path: "/chat" },
  { label: "Documents", path: "/documents" },
  { label: "About", path: "/about" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-indigo-100 bg-white/65 px-6 py-12 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
        <div>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50">
              <BrainCircuit size={23} />
            </span>

            <div>
              <p className="font-bold text-slate-950 dark:text-white">
                DocuMind
              </p>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI Document Intelligence
              </p>
            </div>
          </Link>

          <p className="mt-5 max-w-sm leading-7 text-slate-600 dark:text-slate-400">
            A production-style Retrieval-Augmented Generation application for
            asking questions from PDF documents with grounded answers and source
            citations.
          </p>
        </div>

        <div>
          <h2 className="font-semibold text-slate-950 dark:text-white">
            Product
          </h2>

          <nav className="mt-5 flex flex-col items-start gap-3">
            {footerLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm text-slate-600 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="mt-5 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Explore the source code, connect professionally, or get in touch by
            email.
          </p>

          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://github.com/hemant-312011"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub profile"
              className="flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
            >
              <Code2 size={19} />
            </a>

            <a
              href="https://www.linkedin.com/in/hemant-rao-jenga"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn profile"
              className="flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
            >
              <ExternalLink size={19} />
            </a>

            <a
              href="mailto:hemant.rao.dev@gmail.com"
              aria-label="Send email"
              className="flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:text-indigo-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-indigo-400/40 dark:hover:text-indigo-300"
            >
              <Mail size={19} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-indigo-100 pt-6 text-sm text-slate-500 dark:border-white/10 dark:text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {currentYear} DocuMind RAG. Built for learning and portfolio
          demonstration.
        </p>

        <p>React · TypeScript · Tailwind CSS · LangChain.js</p>
      </div>
    </footer>
  );
}
