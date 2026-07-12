import {
  Bot,
  BrainCircuit,
  Code2,
  Database,
  FileSearch,
  FileText,
  Layers3,
  MessageSquareText,
  Network,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

const technologies = [
  {
    name: "React",
    description: "Component-based frontend interface",
  },
  {
    name: "TypeScript",
    description: "Type-safe application development",
  },
  {
    name: "Tailwind CSS",
    description: "Responsive and reusable UI styling",
  },
  {
    name: "React Router",
    description: "Client-side navigation and pages",
  },
  {
    name: "LangChain.js",
    description: "RAG pipeline orchestration",
  },
  {
    name: "Groq",
    description: "Fast language-model generation",
  },
  {
    name: "Embeddings",
    description: "Semantic meaning representation",
  },
  {
    name: "Vector Search",
    description: "Meaning-based document retrieval",
  },
];

const workflowSteps = [
  {
    icon: FileText,
    title: "Upload",
    description: "User uploads one or multiple PDF documents.",
  },
  {
    icon: Layers3,
    title: "Chunk",
    description: "Large PDF text is divided into focused chunks.",
  },
  {
    icon: Network,
    title: "Embed",
    description: "Chunks are converted into semantic vectors.",
  },
  {
    icon: Database,
    title: "Store",
    description: "Vectors are saved inside a searchable store.",
  },
  {
    icon: FileSearch,
    title: "Retrieve",
    description: "Relevant chunks are found for every question.",
  },
  {
    icon: Bot,
    title: "Generate",
    description: "The LLM creates an answer from retrieved context.",
  },
];

const projectFeatures = [
  {
    icon: FileText,
    title: "Multi-PDF knowledge base",
    description:
      "Manage multiple PDF files inside one searchable document library.",
  },
  {
    icon: FileSearch,
    title: "Semantic retrieval",
    description:
      "Search documents by meaning instead of depending only on exact words.",
  },
  {
    icon: MessageSquareText,
    title: "Streaming answers",
    description:
      "Display responses gradually for a faster and smoother user experience.",
  },
  {
    icon: ShieldCheck,
    title: "Source citations",
    description:
      "Show the PDF file and page used to produce every grounded answer.",
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden px-6 py-20 sm:py-24">
        <div className="absolute left-1/2 top-10 -z-10 size-[28rem] -translate-x-1/2 rounded-full bg-indigo-300/25 blur-[130px] dark:bg-indigo-600/15" />

        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/75 px-4 py-2 text-sm font-semibold text-indigo-700 shadow-sm dark:border-indigo-400/20 dark:bg-indigo-500/10 dark:text-indigo-200">
            <Sparkles size={16} />
            About DocuMind
          </div>

          <h1 className="mx-auto mt-7 max-w-4xl text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-6xl">
            A production-style{" "}
            <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-violet-600 bg-clip-text text-transparent">
              document intelligence
            </span>{" "}
            application
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-400">
            DocuMind uses Retrieval-Augmented Generation to retrieve evidence
            from PDF documents and generate useful answers grounded in the
            uploaded knowledge base.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-[2rem] p-7 sm:p-9">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <BrainCircuit size={28} />
            </span>

            <h2 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
              The problem
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              Large documents are difficult to search manually. Traditional
              keyword search can also miss information that uses different
              wording but carries the same meaning.
            </p>
          </article>

          <article className="glass-panel rounded-[2rem] p-7 sm:p-9">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
              <Workflow size={28} />
            </span>

            <h2 className="mt-6 text-2xl font-bold text-slate-950 dark:text-white">
              The solution
            </h2>

            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-400">
              DocuMind converts PDF content into searchable embeddings,
              retrieves relevant sections and provides them to an AI model for
              grounded answer generation.
            </p>
          </article>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
              RAG workflow
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
              How DocuMind processes knowledge
            </h2>

            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
              Every answer passes through a complete retrieval and generation
              pipeline.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="glass-panel relative rounded-3xl p-6"
                >
                  <span className="absolute right-6 top-5 text-4xl font-black text-indigo-100 dark:text-white/5">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Icon size={24} />
                  </span>

                  <h3 className="mt-5 text-lg font-semibold text-slate-950 dark:text-white">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
              Capabilities
            </p>

            <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white sm:text-4xl">
              Features designed for reliable document chat
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {projectFeatures.map((feature) => {
              const Icon = feature.icon;

              return (
                <article
                  key={feature.title}
                  className="glass-panel rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-400/40"
                >
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
                    <Icon size={24} />
                  </span>

                  <h3 className="mt-5 font-semibold text-slate-950 dark:text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="glass-panel mx-auto max-w-7xl rounded-[2rem] p-7 sm:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-xl">
              <p className="font-semibold uppercase tracking-[0.22em] text-indigo-600 dark:text-indigo-300">
                Technology
              </p>

              <h2 className="mt-4 text-3xl font-bold text-slate-950 dark:text-white">
                Built with a modern JavaScript stack
              </h2>

              <p className="mt-4 leading-7 text-slate-600 dark:text-slate-400">
                The project combines a responsive React frontend with a
                LangChain.js Retrieval-Augmented Generation pipeline.
              </p>
            </div>

            <div className="grid flex-1 gap-3 sm:grid-cols-2">
              {technologies.map((technology) => (
                <article
                  key={technology.name}
                  className="rounded-2xl border border-indigo-100 bg-white/70 p-4 dark:border-white/10 dark:bg-slate-900/70"
                >
                  <h3 className="font-semibold text-slate-950 dark:text-white">
                    {technology.name}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {technology.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-4xl rounded-[2rem] bg-gradient-to-br from-indigo-600 via-violet-600 to-sky-500 p-[1px] shadow-2xl shadow-indigo-200 dark:shadow-indigo-950/40">
          <div className="rounded-[calc(2rem-1px)] bg-white/95 p-8 text-center dark:bg-slate-950/95 sm:p-12">
            <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-300">
              <Code2 size={27} />
            </span>

            <h2 className="mt-6 text-3xl font-bold text-slate-950 dark:text-white">
              Built as a portfolio RAG project
            </h2>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600 dark:text-slate-400">
              The final version will include live deployment, GitHub
              documentation, an architecture diagram, project screenshots and an
              interview-ready technical explanation.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
