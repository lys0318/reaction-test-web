"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatNumber } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { TimerBar } from "@/components/common/TimerBar";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const durations = [1, 5, 10, 30, 60];

export function CPSTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [duration, setDuration] = useState(10);
  const [time, setTime] = useState(10);
  const [clicks, setClicks] = useState(0);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scores = useScores(test.slug);

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  };
  useEffect(() => () => stop(), []);

  const start = () => {
    stop();
    setTime(duration);
    setClicks(0);
    setFinished(false);
    setRunning(true);
    let remaining = duration;
    intervalRef.current = setInterval(() => {
      remaining -= 0.1;
      setTime(Math.max(0, remaining));
      if (remaining <= 0) stop();
    }, 100);
  };

  useEffect(() => {
    if (!running && time <= 0 && !finished) {
      queueMicrotask(() => {
        const nextCps = clicks / duration;
        scores.record(makeStoredScore(test, nextCps));
        setFinished(true);
      });
    }
  }, [clicks, duration, finished, running, scores, test, time]);

  const cps = duration ? clicks / duration : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {durations.map((item) => (
          <Button
            key={item}
            variant={duration === item ? "primary" : "ghost"}
            onClick={() => {
              if (!running) {
                setDuration(item);
                setTime(item);
              }
            }}
          >
            {item}s
          </Button>
        ))}
      </div>
      <TimerBar value={time} max={duration} />
      <button
        type="button"
        disabled={!running}
        onClick={() => setClicks((value) => value + 1)}
        className="min-h-72 w-full select-none rounded-lg border border-cyan-300/25 bg-cyan-300/[0.07] p-8 text-center transition enabled:hover:bg-cyan-300/[0.12] focus:outline-none focus:ring-2 focus:ring-cyan-300 disabled:opacity-80"
      >
        <span className="block text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">{running ? locale === "ko" ? "클릭하세요" : "Click now" : dict.common.ready}</span>
        <span className="mt-4 block text-6xl font-black text-white">{clicks}</span>
      </button>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="CPS" value={formatNumber(cps, 1)} />
        <StatCard label={locale === "ko" ? "총 클릭" : "Total Clicks"} value={`${clicks}`} />
        <StatCard label={locale === "ko" ? "남은 시간" : "Time Left"} value={`${formatNumber(time, 1)}s`} />
      </div>
      {finished ? <ResultCard title={dict.common.result} value={`${formatNumber(cps, 1)} CPS`} rating={ratingFor(test, cps, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
