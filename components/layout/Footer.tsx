import Link from "next/link";
import type { Locale } from "@/lib/locales";
import { getDictionary } from "@/lib/dictionary";

export function Footer({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 text-sm text-slate-400 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-black text-white">{dict.siteName}</p>
            <p>{dict.tagline}</p>
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href={`/${locale}/tests`} className="hover:text-white">{dict.nav.tests}</Link>
            <Link href={`/${locale}/guides`} className="hover:text-white">{dict.nav.guides}</Link>
            <Link href={`/${locale}/about`} className="hover:text-white">{dict.nav.about}</Link>
            <Link href={`/${locale}/contact`} className="hover:text-white">{dict.nav.contact}</Link>
            <Link href={`/${locale}/privacy`} className="hover:text-white">{dict.nav.privacy}</Link>
            <Link href={`/${locale}/terms`} className="hover:text-white">{dict.nav.terms}</Link>
          </div>
        </div>
        <p className="text-xs leading-5">{dict.common.disclaimer}</p>
      </div>
    </footer>
  );
}
