import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/posts";
import { Metadata } from "next";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

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

  return (
    <article className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-10 lg:px-12 max-w-3xl">
        <Link
          href="/#posts"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to writing
        </Link>

        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-medium tracking-tight text-foreground mb-4">
            {post.meta.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted">
            <time>{post.meta.date}</time>
            {post.meta.tags.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-muted/30" />
                {post.meta.tags.map((tag) => (
                  <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/[0.06]">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="prose prose-sm dark:prose-invert max-w-none
          prose-p:text-muted prose-p:leading-relaxed
          prose-headings:text-foreground prose-headings:font-medium
          prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
          prose-code:font-mono prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-white/[0.06] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
          prose-pre:bg-gray-50 dark:prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-white/[0.06]
          prose-strong:text-foreground
          prose-blockquote:border-blue-500/30 prose-blockquote:text-muted
          prose-hr:border-gray-200 dark:prose-hr:border-white/[0.06]
        ">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>
      </div>
    </article>
  );
}
