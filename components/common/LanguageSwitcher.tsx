"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/locales";
import { getOppositeLocale, replaceLocale } from "@/lib/locales";

export function LanguageSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const nextLocale = getOppositeLocale(locale);
  return (
    <Link
      href={replaceLocale(pathname, nextLocale)}
      className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-slate-100 transition hover:border-cyan-300/50 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-300"
      aria-label={nextLocale === "ko" ? "한국어로 전환" : "Switch to English"}
    >
      {nextLocale === "ko" ? "한국어" : "English"}
    </Link>
  );
}
