"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatMs, formatPercent } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { TimerBar } from "@/components/common/TimerBar";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

export function AimTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [hitTimes, setHitTimes] = useState<number[]>([]);
  const targetShownAt = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scores = useScores(test.slug);
  const recordScore = scores.record;

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  }, []);

  useEffect(() => () => stop(), [stop]);

  const moveTarget = () => {
    setTarget({ x: randomInt(10, 90), y: randomInt(16, 84) });
    targetShownAt.current = performance.now();
  };

  const finish = useCallback((finalHits: number, finalMisses: number) => {
    stop();
    const score = Math.max(0, finalHits * 2 - finalMisses);
    recordScore(makeStoredScore(test, score));
  }, [recordScore, stop, test]);

  const start = () => {
    stop();
    setTime(30);
    setHits(0);
    setMisses(0);
    setHitTimes([]);
    setRunning(true);
    moveTarget();
    let remaining = 30;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTime(remaining);
      if (remaining <= 0) finish(hits, misses);
    }, 1000);
  };

  const hit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!running) return;
    setHits((value) => value + 1);
    setHitTimes((value) => [...value, performance.now() - targetShownAt.current]);
    moveTarget();
  };

  const miss = () => {
    if (!running) return;
    setMisses((value) => value + 1);
  };

  useEffect(() => {
    if (running && time <= 0) {
      queueMicrotask(() => finish(hits, misses));
    }
  }, [finish, hits, misses, running, time]);

  const total = hits + misses;
  const accuracy = total ? (hits / total) * 100 : 0;
  const avgHit = hitTimes.length ? hitTimes.reduce((sum, item) => sum + item, 0) / hitTimes.length : 0;
  const score = Math.max(0, hits * 2 - misses);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-bold text-slate-300">
          <span>{time}s</span>
          <span>{dict.common.score}: {score}</span>
        </div>
        <TimerBar value={time} max={30} />
      </div>
      <div
        role="button"
        tabIndex={0}
        onClick={miss}
        className="relative min-h-96 select-none overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label={locale === "ko" ? "에임 테스트 영역" : "Aim test area"}
      >
        {running ? (
          <button
            type="button"
            onClick={hit}
            className="absolute h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-cyan-300 shadow-[0_0_26px_rgba(34,211,238,0.8)] focus:outline-none focus:ring-4 focus:ring-cyan-100"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label={locale === "ko" ? "타깃" : "Target"}
          />
        ) : (
          <div className="grid h-96 place-items-center text-center">
            <p className="text-3xl font-black text-white">{dict.common.ready}</p>
          </div>
        )}
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label={dict.common.hits} value={`${hits}`} />
        <StatCard label={dict.common.misses} value={`${misses}`} />
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
        <StatCard label={locale === "ko" ? "평균 명중 시간" : "Avg hit time"} value={avgHit ? formatMs(avgHit) : "-"} />
      </div>
      {!running && total > 0 ? <ResultCard title={dict.common.result} value={`${score}`} rating={ratingFor(test, score, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
