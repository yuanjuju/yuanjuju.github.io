"use client";

import { motion } from "framer-motion";

interface SkillTagProps {
  name: string;
  level?: number; // 1-5, controls size without reducing text contrast
  delay?: number;
}

export function SkillTag({ name, level = 3, delay = 0 }: SkillTagProps) {
  const sizeMap: Record<number, string> = {
    1: "text-xs px-2.5 py-1",
    2: "text-xs px-3 py-1",
    3: "text-sm px-3 py-1.5",
    4: "text-sm px-4 py-2",
    5: "text-base px-4 py-2",
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ scale: 1.08, y: -1 }}
      className={`inline-block rounded-full
        border border-border bg-tag text-tag-text hover:text-accent
        hover:border-accent hover:bg-accent-soft
        transition-colors duration-200 cursor-default
        ${sizeMap[level] || sizeMap[3]}`}
    >
      {name}
    </motion.span>
  );
}
