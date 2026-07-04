"use client";

import { motion } from "framer-motion";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  gitee?: string;
  image?: string;
  delay?: number;
}

export function ProjectCard({
  title,
  description,
  tags,
  github,
  gitee,
  delay = 0,
}: ProjectCardProps) {
  const repoUrl = github || gitee;
  const repoLabel = github ? "GitHub" : "Gitee";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      whileHover={{ y: -3, transition: { duration: 0.3 } }}
      className="group  rounded-2xl p-6 border border-black/[0.2] hover:shadow-md dark:hover:shadow-black/40"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        {repoUrl && (
          <a
            href={repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-foreground transition-colors ml-3 shrink-0"
            aria-label={`${title} on ${repoLabel}`}
          >
            {github ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            )}
          </a>
        )}
      </div>
      <p className="text-sm text-muted leading-relaxed mb-4">
        {description}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-0.5 text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.article>
  );
}
