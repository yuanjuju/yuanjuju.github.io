import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Not Found" };

  return {
    title: `${post.meta.title} — Jinian`,
    description: post.meta.excerpt,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  const categoryLabel =
    post.meta.category === "life" ? "日常" : "博客";

  return (
    <article className="pt-28 pb-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-6 md:px-10 lg:px-12">
        <Link
          href="/#posts"
          className="mb-10 inline-flex min-h-11 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--article-surface)] px-4 py-2.5 text-base font-medium text-[var(--article-muted)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--article-heading)]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to writing
        </Link>

        <header className="mb-10 md:mb-12">
          <p className="mb-4 font-mono text-xs tracking-[0.16em] text-[var(--accent)]">
            {categoryLabel}
          </p>
          <h1 className="mb-5 text-3xl font-medium leading-tight tracking-tight text-[var(--article-heading)] md:text-5xl">
            {post.meta.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--article-muted)]">
            <time dateTime={post.meta.date}>{post.meta.date}</time>
            {post.meta.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-[var(--article-muted)] opacity-50" />
                {post.meta.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[var(--article-pill)] px-2.5 py-1 text-xs text-[var(--article-muted)]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="article-prose prose max-w-none rounded-3xl border border-border bg-[var(--article-surface)] px-4 py-6 shadow-[var(--card-shadow)] sm:px-6 sm:py-8 md:px-10 md:py-10">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              pre: ({ children }) => (
                <pre tabIndex={0} aria-label="代码示例">{children}</pre>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="文章表格">
                  <table>{children}</table>
                </div>
              ),
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
