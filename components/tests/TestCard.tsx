import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { categoryLabels } from "@/lib/tests";
import { LinkButton } from "@/components/common/Button";

export function TestCard({ test, locale }: { test: TestDefinition; locale: Locale }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 hover:bg-white/[0.06]">
      <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-bold">
        <span className="rounded-md bg-cyan-300/10 px-2.5 py-1 text-cyan-200">{categoryLabels[test.category][locale]}</span>
        <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-slate-300">{test.duration[locale]}</span>
        <span className="rounded-md bg-white/[0.06] px-2.5 py-1 text-slate-300">{test.difficulty[locale]}</span>
      </div>
      <h3 className="text-xl font-black tracking-tight text-white">{test.title[locale]}</h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-slate-300">{test.description[locale]}</p>
      <LinkButton href={`/${locale}/tests/${test.slug}`} className="mt-5 w-full" variant="secondary">
        {locale === "ko" ? "시작하기" : "Start"}
      </LinkButton>
    </article>
  );
}
