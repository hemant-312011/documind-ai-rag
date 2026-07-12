import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("documind-theme");

  if (savedTheme === "dark") {
    return "dark";
  }

  return "light";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const rootElement = document.documentElement;

    if (theme === "dark") {
      rootElement.classList.add("dark");
    } else {
      rootElement.classList.remove("dark");
    }

    localStorage.setItem("documind-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  }

  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative flex size-10 items-center justify-center rounded-xl border border-indigo-100 bg-white text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-50 dark:border-white/10 dark:bg-slate-900 dark:text-amber-300 dark:hover:border-indigo-400/40 dark:hover:bg-slate-800"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Light mode" : "Dark mode"}
    >
      {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
