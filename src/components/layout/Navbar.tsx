"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Timeline", href: "#timeline" },
  { label: "Writing", href: "#posts" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 dark:bg-black/50 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12 h-16 flex items-center justify-between">
        <button
          onClick={() => {
            const el = document.querySelector("#hero");
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="flex items-center gap-2.5"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-gray-200 dark:ring-white/[0.08] shrink-0">
            <img
              src="/images/avatar.jpg"
              alt="Julian"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-medium tracking-tight text-foreground">
            Julian
          </span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => {
                const el = document.querySelector(item.href);
                if (el) {
                  const offset = 80;
                  const top = el.getBoundingClientRect().top + window.scrollY - offset;
                  window.scrollTo({ top, behavior: "smooth" });
                }
              }}
              className="text-sm text-muted hover:text-foreground transition-colors duration-200"
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-5 h-5 flex items-center justify-center text-muted"
            aria-label="Menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/90 dark:bg-black/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/[0.06] overflow-hidden"
          >
            <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
              {navItems.map((item) => (
                <button
                  key={item.href}
                  onClick={() => {
                    setMobileOpen(false);
                    const el = document.querySelector(item.href);
                    if (el) {
                      const offset = 80;
                      const top = el.getBoundingClientRect().top + window.scrollY - offset;
                      window.scrollTo({ top, behavior: "smooth" });
                    }
                  }}
                  className="text-sm text-muted hover:text-foreground transition-colors py-1 text-left"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
