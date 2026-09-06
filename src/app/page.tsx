import { HomePage } from "@/components/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { languages: { en: "https://yuanjuju.github.io/en/", "zh-CN": "https://yuanjuju.github.io/" } },
};

export default function Home() {
  return <HomePage />;
}
