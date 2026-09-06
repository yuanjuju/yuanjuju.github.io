import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Locale } from "@/lib/i18n";

const postsDirectory = path.join(process.cwd(), "content/posts");

function directoryFor(locale: Locale) {
  return locale === "en" ? path.join(postsDirectory, "en") : postsDirectory;
}

export type PostCategory = "tech" | "life";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  category: PostCategory;
}

function getPostCategory(category: unknown): PostCategory {
  return category === "life" ? "life" : "tech";
}

export function getAllPosts(locale: Locale = "original"): PostMeta[] {
  const directory = directoryFor(locale);
  if (!fs.existsSync(directory)) {
    return [];
  }

  const fileNames = fs.readdirSync(directory);
  const posts = fileNames
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => {
      const slug = fn.replace(/\.md$/, "");
      const fullPath = path.join(directory, fn);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        category: getPostCategory(data.category),
      } as PostMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string, locale: Locale = "original"): {
  content: string;
  meta: PostMeta;
} | null {
  try {
    const fullPath = path.join(directoryFor(locale), `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      content,
      meta: {
        slug,
        title: data.title || slug,
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
        category: getPostCategory(data.category),
      },
    };
  } catch {
    return null;
  }
}
