"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import type { PostCategory, PostMeta } from "@/lib/posts";
import { useLocale } from "@/components/LocaleProvider";
import { localizePath, categoryLabels } from "@/lib/i18n";
import { english } from "@/lib/english";

const categories: Array<{
  id: PostCategory;
  index: string;
  label: string;
}> = [
  {
    id: "tech",
    index: "01",
    label: "博客",
  },
  {
    id: "life",
    index: "02",
    label: "日常",
  },
];

function formatDate(date: string) {
  return date.replaceAll("-", ".");
}

export function LatestPosts({ posts }: { posts: PostMeta[] }) {
  const locale = useLocale();
  return (
    <SectionWrapper id="posts" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12">
        <div className="mb-14 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            Writing
          </h2>
          <p className="text-muted text-base leading-relaxed max-w-2xl">
            {locale === "en" ? english.writing : "写些技术，也记些生活。"}
          </p>
        </div>

        <div className="border-t border-[var(--border)]">
          {categories.map((category, categoryIndex) => {
            const categoryPosts = posts.filter(
              (post) => post.category === category.id,
            );

            return (
              <motion.section
                key={category.id}
                aria-labelledby={`${category.id}-posts-heading`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.6,
                  delay: categoryIndex * 0.08,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="grid gap-8 border-b border-[var(--border)] py-10 md:grid-cols-[180px_1fr] md:gap-12 md:py-12"
              >
                <header>
                  <p className="mb-3 font-mono text-xs tracking-[0.18em] text-muted">
                    {category.index}
                  </p>
                  <h3
                    id={`${category.id}-posts-heading`}
                    className="text-xl font-medium tracking-tight text-foreground"
                  >
                    {categoryLabels[locale][category.id]}
                  </h3>
                </header>

                <div className="divide-y divide-[var(--border)]">
                  {categoryPosts.map((post, postIndex) => (
                    <article key={post.slug}>
                      <Link
                        href={localizePath(`/posts/${post.slug}`, locale)}
                        className="group -mx-3 grid gap-3 rounded-xl px-3 py-4 transition-colors hover:bg-surface-hover focus-visible:bg-surface-hover sm:grid-cols-[1fr_auto] sm:gap-8"
                      >
                        <div>
                          <h4 className="text-base font-medium leading-snug text-foreground transition-colors group-hover:text-[var(--accent)] md:text-lg">
                            {post.title}
                          </h4>
                          {post.excerpt && (
                            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                              {post.excerpt}
                            </p>
                          )}
                          {post.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5">
                              {post.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-xs text-muted"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                          <time
                            dateTime={post.date}
                            className="font-mono text-xs text-muted"
                          >
                            {formatDate(post.date)}
                          </time>
                          <span
                            aria-hidden="true"
                            className="mt-4 hidden text-lg text-muted transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[var(--accent)] sm:block"
                          >
                            ↗
                          </span>
                          <span className="font-mono text-xs text-muted sm:hidden">
                            {String(postIndex + 1).padStart(2, "0")}
                          </span>
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </motion.section>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
