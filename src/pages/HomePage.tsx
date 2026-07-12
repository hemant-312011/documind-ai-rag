import {
  ArrowRight,
  FileSearch,
  Files,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import { Link } from "react-router-dom";

import FeatureCard from "../components/ui/FeatureCard";

const features = [
  {
    icon: UploadCloud,
    title: "Smart PDF Upload",
    description:
      "Upload documents and prepare their content for semantic retrieval.",
  },
  {
    icon: FileSearch,
    title: "Meaning-Based Search",
    description:
      "Retrieve useful chunks by semantic meaning instead of exact keywords.",
  },
  {
    icon: MessageSquareText,
    title: "Grounded AI Answers",
    description:
      "Generate clear answers using only the context retrieved from documents.",
  },
  {
    icon: ShieldCheck,
    title: "Source Citations",
    description:
      "Show the document name and page used to generate every grounded answer.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-24 sm:py-32">
        <div className="absolute left-1/2 top-20 -z-10 size-[30rem] -translate-x-1/2 rounded-full bg-indigo-300/25 blur-[120px]" />

        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-sm font-medium text-indigo-700 shadow-sm">
            <Sparkles size={16} />
            Production-style Retrieval-Augmented Generation
          </div>

          <h1 className="mx-auto max-w-5xl text-5xl font-black tracking-tight text-slate-950 sm:text-7xl">
            Turn your documents into an{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-violet-600 bg-clip-text text-transparent">
              intelligent knowledge assistant
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-600 sm:text-xl">
            Upload PDFs, ask natural-language questions and receive grounded
            answers with page-level citations.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/upload"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 font-semibold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Upload documents
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/chat"
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-indigo-200 bg-white px-6 py-3.5 font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50"
            >
              Open RAG chat
            </Link>
          </div>

          <div className="glass-panel mx-auto mt-16 grid max-w-4xl grid-cols-1 overflow-hidden rounded-3xl sm:grid-cols-3">
            <div className="p-7">
              <Files className="mx-auto text-indigo-600" />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                Multi-PDF
              </p>

              <p className="mt-1 text-sm text-slate-500">Knowledge retrieval</p>
            </div>

            <div className="border-y border-indigo-100 p-7 sm:border-x sm:border-y-0">
              <MessageSquareText className="mx-auto text-sky-600" />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                Streaming
              </p>

              <p className="mt-1 text-sm text-slate-500">Live AI responses</p>
            </div>

            <div className="p-7">
              <ShieldCheck className="mx-auto text-violet-600" />

              <p className="mt-3 text-2xl font-bold text-slate-900">
                Citations
              </p>

              <p className="mt-1 text-sm text-slate-500">Verifiable sources</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600">
              Core capabilities
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
              Everything required for a serious RAG portfolio project
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
