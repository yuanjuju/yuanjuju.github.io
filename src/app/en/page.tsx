import type { Metadata } from "next";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  title: "Julian",
  description: "Julian — developer & researcher",
  alternates: { languages: { en: "https://yuanjuju.github.io/en/", "zh-CN": "https://yuanjuju.github.io/" } },
};

export default function EnglishHome() {
  return <HomePage locale="en" />;
}
