"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useLocale } from "@/components/LocaleProvider";

export function ThemeToggle() {
  const isEnglish = useLocale() === "en";
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="group relative flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-0 bg-transparent text-muted transition-colors duration-200 hover:text-accent"
      whileTap={{ scale: 0.9 }}
      title={isEnglish ? "Switch light / dark mode" : "切换日间 / 夜间模式"}
    >
      <span className="hidden transition-transform duration-300 motion-safe:group-hover:rotate-45 motion-safe:group-hover:scale-110 dark:inline">
        <span className="sr-only">{isEnglish ? "Switch to light mode" : "切换到日间模式"}</span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      </span>
      <span className="transition-transform duration-300 motion-safe:group-hover:-rotate-12 motion-safe:group-hover:scale-110 dark:hidden">
        <span className="sr-only">{isEnglish ? "Switch to dark mode" : "切换到夜间模式"}</span>
        <svg
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      </span>
    </motion.button>
  );
}
