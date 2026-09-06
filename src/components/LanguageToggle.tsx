"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { localizePath } from "@/lib/i18n";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

export function LanguageToggle({ onNavigate }: { onNavigate?: () => void }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const hash = useSyncExternalStore(subscribeToHash, () => window.location.hash, () => "");
  const targetLocale = locale === "en" ? "original" : "en";
  const label = locale === "en" ? "Switch to the original version" : "切换到全英文版";

  return (
    <Link
      href={`${localizePath(pathname, targetLocale)}${hash}`}
      hrefLang={targetLocale === "en" ? "en" : "zh-CN"}
      aria-label={label}
      title={label}
      onClick={onNavigate}
      onNavigate={(event) => {
        event.preventDefault();
        router.push(`${localizePath(pathname, targetLocale)}${window.location.hash}`);
      }}
      className="group inline-flex h-11 min-w-11 shrink-0 items-center justify-center rounded-md border-0 bg-transparent px-2 text-sm font-medium tracking-wide text-muted transition-colors duration-200 hover:text-accent"
    >
      <span className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-200 group-hover:after:scale-x-100 motion-reduce:after:transition-none">
        {locale === "en" ? "Original" : "EN"}
      </span>
    </Link>
  );
}
