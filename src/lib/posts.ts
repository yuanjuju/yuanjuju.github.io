import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const posts = fileNames
    .filter((fn) => fn.endsWith(".md"))
    .map((fn) => {
      const slug = fn.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fn);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        date: data.date ? new Date(data.date).toISOString().split("T")[0] : "",
        excerpt: data.excerpt || "",
        tags: data.tags || [],
      } as PostMeta;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return posts;
}

export function getPostBySlug(slug: string): {
  content: string;
  meta: PostMeta;
} | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
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
      },
    };
  } catch {
    return null;
  }
}
