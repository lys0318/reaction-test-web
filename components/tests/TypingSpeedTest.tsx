"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatPercent, formatWpm } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { TimerBar } from "@/components/common/TimerBar";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const samples: Record<Locale, string[]> = {
  ko: [
    "빠른 반응은 침착한 집중에서 시작됩니다.",
    "정확한 입력은 높은 점수를 만드는 가장 짧은 길입니다.",
    "오늘의 작은 연습이 내일의 안정적인 실력이 됩니다.",
    "화면을 넓게 보고 손끝의 리듬을 일정하게 유지하세요.",
    "테스티어에서 나만의 최고 기록을 갱신해 보세요.",
  ],
  en: [
    "Fast reactions begin with calm focus.",
    "Accurate typing is the shortest path to a higher score.",
    "Small practice today becomes reliable skill tomorrow.",
    "Scan the screen widely and keep your rhythm steady.",
    "Use Testier to beat your personal best.",
  ],
};

const durations = [30, 60, 120];

function sampleFor(locale: Locale, duration: number) {
  const pool = samples[locale];
  const repeat = duration >= 120 ? 4 : duration >= 60 ? 2 : 1;
  const start = randomInt(0, pool.length - 1);
  return Array.from({ length: repeat }, (_, index) => pool[(start + index) % pool.length]).join(" ");
}

function accuracyFor(target: string, input: string): number {
  if (!input.length) return 0;
  let correct = 0;
  for (let i = 0; i < input.length; i += 1) {
    if (input[i] === target[i]) correct += 1;
  }
  return (correct / input.length) * 100;
}

export function TypingSpeedTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [sample, setSample] = useState(samples[locale][0]);
  const [duration, setDuration] = useState(60);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
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
    setSample(sampleFor(locale, duration));
    setInput("");
    setElapsed(0);
    setFinished(false);
    setRunning(true);
    const started = performance.now();
    intervalRef.current = setInterval(() => {
      const nextElapsed = Math.min(duration, (performance.now() - started) / 1000);
      setElapsed(nextElapsed);
      if (nextElapsed >= duration) stop();
    }, 100);
  };

  const wpm = elapsed > 0 ? (input.length / 5 / elapsed) * 60 : 0;
  const accuracy = accuracyFor(sample, input);

  useEffect(() => {
    if (running && input === sample) {
      queueMicrotask(stop);
    }
  }, [input, running, sample]);

  useEffect(() => {
    if (!running && elapsed > 0 && !finished) {
      queueMicrotask(() => {
        scores.record(makeStoredScore(test, wpm));
        setFinished(true);
      });
    }
  }, [elapsed, finished, running, scores, test, wpm]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2">
        {durations.map((item) => (
          <Button
            key={item}
            variant={duration === item ? "primary" : "ghost"}
            onClick={() => {
              if (!running) setDuration(item);
            }}
          >
            {item}s
          </Button>
        ))}
      </div>
      <TimerBar value={duration - elapsed} max={duration} />
      <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-5">
        <p className="text-lg leading-8 text-slate-100">{sample}</p>
        <textarea
          value={input}
          onChange={(event) => running && setInput(event.target.value)}
          className="mt-4 min-h-36 w-full rounded-lg border border-white/10 bg-black/40 p-4 text-base leading-7 text-white outline-none focus:border-cyan-300"
          placeholder={locale === "ko" ? "시작 후 여기에 입력하세요." : "Start, then type here."}
        />
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="WPM" value={formatWpm(wpm)} />
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
        <StatCard label={locale === "ko" ? "경과 시간" : "Elapsed"} value={`${Math.round(elapsed)}s`} />
      </div>
      {finished ? <ResultCard title={dict.common.result} value={formatWpm(wpm)} rating={ratingFor(test, wpm, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
