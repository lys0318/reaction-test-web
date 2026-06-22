"use client";

import type { Locale } from "@/lib/locales";
import type { StoredScore } from "@/lib/storage";
import { getDictionary } from "@/lib/dictionary";
import { Button } from "@/components/common/Button";
import { ScoreTrend } from "./ScoreTrend";

export function ScoreHistory({
  locale,
  best,
  recent,
  onClear,
}: {
  locale: Locale;
  best: StoredScore | null;
  recent: StoredScore[];
  onClear: () => void;
}) {
  const dict = getDictionary(locale);
  return (
    <section className="grid gap-4 md:grid-cols-[1fr_1.3fr]">
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{dict.common.best}</p>
        <p className="mt-3 text-2xl font-black text-white">{best?.label || "-"}</p>
        {best ? <p className="mt-1 text-xs text-slate-500">{new Date(best.createdAt).toLocaleString()}</p> : null}
      </div>
      <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{dict.common.recent}</p>
          <Button variant="ghost" className="min-h-8 px-3 py-1 text-xs" onClick={onClear}>
            {dict.common.clear}
          </Button>
        </div>
        <div className="mt-3 grid gap-2">
          {recent.length ? (
            recent.map((score) => (
              <div key={`${score.createdAt}-${score.value}`} className="flex items-center justify-between rounded-md bg-slate-950/60 px-3 py-2 text-sm">
                <span className="font-semibold text-slate-100">{score.label}</span>
                <span className="text-xs text-slate-500">{new Date(score.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-400">-</p>
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        <ScoreTrend
          recent={recent}
          title={locale === "ko" ? "최근 기록 그래프" : "Recent Score Trend"}
          emptyLabel={locale === "ko" ? "두 번 이상 테스트하면 기록 변화가 그래프로 표시됩니다." : "Run at least two tests to see your score trend."}
        />
      </div>
    </section>
  );
}
