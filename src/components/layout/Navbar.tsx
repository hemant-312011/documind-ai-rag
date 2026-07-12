import { BrainCircuit, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

import ThemeToggle from "../ui/ThemeToggle";

const links = [
  { label: "Home", path: "/" },
  { label: "Upload", path: "/upload" },
  { label: "Chat", path: "/chat" },
  { label: "Documents", path: "/documents" },
  { label: "About", path: "/about" },
];

function getLinkClasses(isActive: boolean): string {
  return [
    "rounded-xl px-4 py-2 text-sm font-medium transition duration-200",
    isActive
      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:bg-indigo-500 dark:shadow-indigo-950/40"
      : "text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white",
  ].join(" ");
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-3"
          onClick={() => setIsOpen(false)}
        >
          <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-950/50">
            <BrainCircuit size={22} />
          </span>

          <div>
            <p className="font-bold tracking-tight text-slate-900 dark:text-white">
              DocuMind
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              AI Document Intelligence
            </p>
          </div>
        </NavLink>

        <div className="hidden items-center gap-2 md:flex">
          <div className="flex items-center gap-1">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => getLinkClasses(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />

          <button
            type="button"
            className="rounded-xl border border-indigo-100 bg-white p-2 text-slate-700 shadow-sm dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
            aria-label="Toggle navigation"
            onClick={() => setIsOpen((currentValue) => !currentValue)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {isOpen && (
        <div className="border-t border-indigo-100 bg-white px-6 py-4 dark:border-white/10 dark:bg-slate-950 md:hidden">
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => getLinkClasses(isActive)}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
