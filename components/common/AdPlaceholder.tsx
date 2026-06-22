import type { Locale } from "@/lib/locales";
import { getDictionary } from "@/lib/dictionary";

export function AdPlaceholder({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const dict = getDictionary(locale);
  return (
    <aside
      aria-label={dict.common.ad}
      className={`flex w-full items-center justify-center rounded-lg border border-dashed border-cyan-300/25 bg-slate-950/70 text-center text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/70 ${
        compact ? "min-h-20" : "min-h-28"
      }`}
    >
      {dict.common.ad}
    </aside>
  );
}
