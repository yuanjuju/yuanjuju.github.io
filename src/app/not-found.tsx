"use client";

import Link from "next/link";
import { useLocale } from "@/components/LocaleProvider";
import { localizePath } from "@/lib/i18n";

export default function NotFound() {
  const locale = useLocale();
  const isEnglish = locale === "en";
  return (
    <section className="mx-auto flex min-h-[75vh] max-w-2xl flex-col items-center justify-center px-6 pb-16 pt-32 text-center">
      <p className="mb-4 font-mono text-sm tracking-widest text-accent">404</p>
      <h1 className="mb-4 text-3xl font-medium tracking-tight text-foreground">{isEnglish ? "This page could not be found" : "这一页暂时找不到"}</h1>
      <p className="mb-8 text-muted">{isEnglish ? "Head back home to explore the blog and life updates." : "可以回到主页，继续看看博客和日常。"}</p>
      <Link href={localizePath("/", locale)} className="theme-card theme-card-interactive inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-accent">
        {isEnglish ? "Back to home" : "返回主页"}
      </Link>
    </section>
  );
}
