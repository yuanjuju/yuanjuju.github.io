import type { Metadata } from "next";
import { PostPage } from "@/components/PostPage";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

interface Props { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getAllPosts("en").map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");
  if (!post) return { title: "Not Found" };
  return {
    title: `${post.meta.title} — Jinian`,
    description: post.meta.excerpt,
    alternates: { languages: {
      en: `https://yuanjuju.github.io/en/posts/${slug}/`,
      "zh-CN": `https://yuanjuju.github.io/posts/${slug}/`,
    } },
  };
}

export default async function EnglishPost({ params }: Props) {
  const { slug } = await params;
  return <PostPage slug={slug} locale="en" />;
}
