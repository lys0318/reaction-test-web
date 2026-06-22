import type { Locale } from "@/lib/locales";
import { AdFitBanner } from "./AdFitBanner";

export function AdPlaceholder({ locale }: { locale: Locale }) {
  return (
    <div className="w-full">
      <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
        {locale === "ko" ? "광고" : "Advertisement"}
      </p>
      <AdFitBanner />
    </div>
  );
}
