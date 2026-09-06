export type Locale = "original" | "en";

export function localeFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "original";
}

export function localizePath(path: string, locale: Locale): string {
  const original = path.replace(/^\/en(?=\/|#|$)/, "") || "/";
  if (locale === "original") return original.startsWith("#") ? `/${original}` : original;
  return `/en${original}`;
}

export const categoryLabels = {
  original: { tech: "博客", life: "日常" },
  en: { tech: "Blog", life: "Life" },
};
