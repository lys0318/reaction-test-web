"use client";

import { useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatMs } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const targetCount = 30;

export function AimTrainer30Test({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [times, setTimes] = useState<number[]>([]);
  const [totalMs, setTotalMs] = useState(0);
  const startedAt = useRef(0);
  const targetShownAt = useRef(0);
  const scores = useScores(test.slug);

  const moveTarget = () => {
    setTarget({ x: randomInt(8, 92), y: randomInt(14, 86) });
    targetShownAt.current = performance.now();
  };

  const start = () => {
    setTimes([]);
    setTotalMs(0);
    startedAt.current = performance.now();
    setRunning(true);
    moveTarget();
  };

  const hit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!running) return;
    const nextTimes = [...times, performance.now() - targetShownAt.current];
    setTimes(nextTimes);
    if (nextTimes.length >= targetCount) {
      const avg = nextTimes.reduce((sum, item) => sum + item, 0) / nextTimes.length;
      scores.record(makeStoredScore(test, avg));
      setTotalMs(performance.now() - startedAt.current);
      setRunning(false);
    } else {
      moveTarget();
    }
  };

  const average = times.length ? times.reduce((sum, item) => sum + item, 0) / times.length : 0;
  const fastest = times.length ? Math.min(...times) : 0;

  return (
    <div className="space-y-5">
      <div className="relative min-h-96 select-none overflow-hidden rounded-lg border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.12),rgba(2,6,23,0.95)_55%)]">
        {running ? (
          <button
            type="button"
            onClick={hit}
            className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cyan-300 shadow-[0_0_28px_rgba(34,211,238,0.82)] focus:outline-none focus:ring-4 focus:ring-cyan-100"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label={locale === "ko" ? "타깃" : "Target"}
          />
        ) : (
          <div className="grid min-h-96 place-items-center text-center">
            <div>
              <p className="text-3xl font-black text-white">{dict.common.ready}</p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{locale === "ko" ? "30개의 타깃을 최대한 빠르게 클릭하세요." : "Click 30 targets as quickly as possible."}</p>
            </div>
          </div>
        )}
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label={locale === "ko" ? "타깃" : "Targets"} value={`${times.length}/${targetCount}`} />
        <StatCard label={dict.common.average} value={average ? formatMs(average) : "-"} />
        <StatCard label={locale === "ko" ? "최고" : "Fastest"} value={fastest ? formatMs(fastest) : "-"} />
        <StatCard label={locale === "ko" ? "총 시간" : "Total"} value={totalMs ? `${(totalMs / 1000).toFixed(1)}s` : "-"} />
      </div>
      {!running && times.length >= targetCount ? <ResultCard title={dict.common.result} value={formatMs(average)} rating={ratingFor(test, average, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
