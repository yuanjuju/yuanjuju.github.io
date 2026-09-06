import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { getAllPosts } from "@/lib/posts";
import type { Locale } from "@/lib/i18n";

export function HomePage({ locale = "original" }: { locale?: Locale }) {
  const posts = getAllPosts(locale);

  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Timeline />
      <LatestPosts posts={posts} />
    </>
  );
}
