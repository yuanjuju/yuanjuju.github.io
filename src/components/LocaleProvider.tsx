"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>("original");

export function LocaleProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  const language = locale === "en" ? "en" : "zh-CN";

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LocaleContext.Provider value={locale}>
      <div lang={language}>{children}</div>
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
