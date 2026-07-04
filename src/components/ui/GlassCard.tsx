"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  delay = 0,
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      whileHover={
        hover
          ? { scale: 1.02, y: -2, transition: { duration: 0.3 } }
          : undefined
      }
      className={`bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-gray-200/50 dark:border-white/[0.06] rounded-2xl shadow-sm p-6 md:p-8 transition-shadow duration-300 ${
        hover ? "hover:shadow-md dark:hover:shadow-white/10" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
