"use client";

import { useEffect, useRef, useState } from "react";
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

type Signal = { x: number; y: number; label: string } | null;

const positions = [
  { x: 12, y: 18, label: "top-left" },
  { x: 88, y: 18, label: "top-right" },
  { x: 12, y: 82, label: "bottom-left" },
  { x: 88, y: 82, label: "bottom-right" },
  { x: 50, y: 12, label: "top" },
  { x: 50, y: 88, label: "bottom" },
  { x: 8, y: 50, label: "left" },
  { x: 92, y: 50, label: "right" },
];

export function PeripheralReactionTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [signal, setSignal] = useState<Signal>(null);
  const [times, setTimes] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shownAt = useRef(0);
  const scores = useScores(test.slug);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => clearTimer, []);

  const showSignal = () => {
    const next = positions[randomInt(0, positions.length - 1)];
    setSignal(next);
    shownAt.current = performance.now();
  };

  const scheduleSignal = (nextRound: number) => {
    clearTimer();
    setSignal(null);
    setRound(nextRound);
    timeoutRef.current = setTimeout(showSignal, randomInt(900, 2400));
  };

  const start = () => {
    setRunning(true);
    setTimes([]);
    scheduleSignal(1);
  };

  const hit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (!running || !signal) return;
    const ms = performance.now() - shownAt.current;
    const nextTimes = [...times, ms];
    setTimes(nextTimes);
    if (round >= 8) {
      const avg = nextTimes.reduce((sum, item) => sum + item, 0) / nextTimes.length;
      scores.record(makeStoredScore(test, avg));
      setRunning(false);
      setSignal(null);
    } else {
      scheduleSignal(round + 1);
    }
  };

  const average = times.length ? times.reduce((sum, item) => sum + item, 0) / times.length : 0;
  const best = times.length ? Math.min(...times) : 0;

  return (
    <div className="space-y-5">
      <div className="relative min-h-96 overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950">
        <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-200 bg-cyan-300/30" />
        {signal ? (
          <button
            type="button"
            onClick={hit}
            className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-emerald-300 shadow-[0_0_32px_rgba(110,231,183,0.78)] focus:outline-none focus:ring-4 focus:ring-emerald-100"
            style={{ left: `${signal.x}%`, top: `${signal.y}%` }}
            aria-label={signal.label}
          />
        ) : (
          <div className="grid min-h-96 place-items-center text-center">
            <div>
              <p className="text-3xl font-black text-white">{running ? (locale === "ko" ? "중앙을 보세요" : "Watch the center") : dict.common.ready}</p>
              <p className="mt-3 text-sm text-slate-400">{locale === "ko" ? "가장자리에 신호가 나타나면 누르세요." : "Tap the signal when it appears near the edge."}</p>
            </div>
          </div>
        )}
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={dict.common.average} value={average ? formatMs(average) : "-"} />
        <StatCard label={locale === "ko" ? "최고" : "Best"} value={best ? formatMs(best) : "-"} />
        <StatCard label={dict.common.rounds} value={`${times.length}/8`} />
      </div>
      {!running && times.length >= 8 ? <ResultCard title={dict.common.result} value={formatMs(average)} rating={ratingFor(test, average, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
