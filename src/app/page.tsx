import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Timeline } from "@/components/sections/Timeline";
import { LatestPosts } from "@/components/sections/LatestPosts";
import { getAllPosts } from "@/lib/posts";

export default function Home() {
  const posts = getAllPosts();

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
