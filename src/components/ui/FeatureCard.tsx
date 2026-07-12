import type { LucideIcon } from "lucide-react";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export default function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="glass-panel group rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:border-indigo-300 dark:hover:border-indigo-400/40">
      <span className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100 transition group-hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-300 dark:ring-indigo-400/20 dark:group-hover:bg-indigo-500/20">
        <Icon size={24} />
      </span>

      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-slate-600 dark:text-slate-400">
        {description}
      </p>
    </article>
  );
}
