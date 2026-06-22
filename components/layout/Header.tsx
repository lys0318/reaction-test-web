import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { getDictionary } from "@/lib/dictionary";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export function Header({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const nav = [
    { href: `/${locale}/tests`, label: dict.nav.tests },
    { href: `/${locale}/guides`, label: dict.nav.guides },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/privacy`, label: dict.nav.privacy },
    { href: `/${locale}/terms`, label: dict.nav.terms },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/82 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-cyan-300">
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-cyan-300/35 bg-cyan-300/10 text-lg font-black text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.18)]">
            T
            <span className="absolute -bottom-1 -right-1 rounded bg-emerald-300 px-1 text-[9px] font-black leading-3 text-slate-950">S</span>
          </span>
          <span className="text-lg font-black tracking-tight text-white">{dict.siteName}</span>
        </Link>
        <nav className="hidden items-center gap-5 md:flex" aria-label="Primary navigation">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-semibold text-slate-300 transition hover:text-white">
              {item.label}
            </Link>
          ))}
        </nav>
        <LanguageSwitcher locale={locale} />
      </div>
    </header>
  );
}
