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

export function SpacebarCounterTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [duration, setDuration] = useState(10);
  const [time, setTime] = useState(10);
  const [count, setCount] = useState(0);
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
    setCount(0);
    setTime(duration);
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
    const onKey = (event: KeyboardEvent) => {
      if (event.code === "Space" && running) {
        event.preventDefault();
        setCount((value) => value + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [running]);

  useEffect(() => {
    if (!running && time <= 0 && !finished) {
      queueMicrotask(() => {
        scores.record(makeStoredScore(test, count / duration));
        setFinished(true);
      });
    }
  }, [count, duration, finished, running, scores, test, time]);

  const ips = count / duration;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {[5, 10, 30].map((item) => (
          <Button key={item} variant={duration === item ? "primary" : "ghost"} onClick={() => !running && (setDuration(item), setTime(item))}>
            {item}s
          </Button>
        ))}
      </div>
      <TimerBar value={time} max={duration} />
      <button
        type="button"
        onClick={() => running && setCount((value) => value + 1)}
        className="min-h-72 w-full select-none rounded-lg border border-violet-300/25 bg-violet-300/[0.07] p-8 text-center transition hover:bg-violet-300/[0.11] focus:outline-none focus:ring-2 focus:ring-violet-300"
      >
        <span className="block text-sm font-bold uppercase tracking-[0.18em] text-violet-200">
          {running ? (locale === "ko" ? "스페이스바 또는 탭" : "Press Space or Tap") : dict.common.ready}
        </span>
        <span className="mt-4 block text-6xl font-black text-white">{count}</span>
      </button>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={locale === "ko" ? "초당 입력" : "Inputs/sec"} value={formatNumber(ips, 1)} />
        <StatCard label={locale === "ko" ? "총 입력" : "Total Inputs"} value={`${count}`} />
        <StatCard label={locale === "ko" ? "남은 시간" : "Time Left"} value={`${formatNumber(time, 1)}s`} />
      </div>
      {finished ? <ResultCard title={dict.common.result} value={`${formatNumber(ips, 1)} /s`} rating={ratingFor(test, ips, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
