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

type Phase = "idle" | "lights" | "go" | "falseStart" | "done";

export function F1RaceStartTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [lights, setLights] = useState(0);
  const [result, setResult] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const startRef = useRef(0);
  const scores = useScores(test.slug);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => () => clearTimers(), []);

  const start = () => {
    clearTimers();
    setPhase("lights");
    setLights(0);
    setResult(null);

    for (let index = 1; index <= 5; index += 1) {
      timers.current.push(setTimeout(() => setLights(index), index * 620));
    }

    timers.current.push(
      setTimeout(() => {
        startRef.current = performance.now();
        setPhase("go");
      }, 5 * 620 + randomInt(700, 2200))
    );
  };

  const press = () => {
    if (phase === "idle" || phase === "done") return;
    if (phase === "lights") {
      clearTimers();
      setPhase("falseStart");
      return;
    }
    if (phase === "falseStart") {
      start();
      return;
    }
    const ms = performance.now() - startRef.current;
    setResult(ms);
    scores.record(makeStoredScore(test, ms));
    setPhase("done");
  };

  const status = {
    idle: locale === "ko" ? "시작을 누르면 빨간불 카운트다운이 시작됩니다." : "Press start to begin the red-light countdown.",
    lights: locale === "ko" ? "빨간불을 기다리세요. 아직 누르지 마세요." : "Wait for the lights. Do not tap yet.",
    go: locale === "ko" ? "레이스 스타트!" : "Race Start!",
    falseStart: locale === "ko" ? "조기 출발입니다. 다시 시작하세요." : "False start. Try again.",
    done: locale === "ko" ? "피니시" : "Finish",
  }[phase];

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={press}
        onTouchStart={(event) => {
          event.preventDefault();
          press();
        }}
        className={`w-full select-none rounded-lg border p-5 text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
          phase === "go"
            ? "border-emerald-300/60 bg-emerald-400/20"
            : phase === "falseStart"
              ? "border-rose-300/60 bg-rose-400/20"
              : "border-red-300/20 bg-slate-950/85"
        }`}
        aria-label={status}
      >
        <div className="mx-auto grid max-w-2xl grid-cols-5 gap-2 sm:gap-4">
          {Array.from({ length: 5 }, (_, index) => (
            <span
              key={index}
              className={`aspect-square rounded-full border transition ${
                lights > index
                  ? "border-red-200 bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.72)]"
                  : "border-white/10 bg-white/[0.04]"
              }`}
            />
          ))}
        </div>
        <p className="mt-8 text-sm font-black uppercase tracking-[0.22em] text-slate-300">F1 Start System</p>
        <p className="mt-3 text-4xl font-black text-white sm:text-6xl">{status}</p>
      </button>
      <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label={dict.common.result} value={result ? formatMs(result) : "-"} />
        <StatCard label={locale === "ko" ? "켜진 빨간불" : "Red Lights"} value={`${lights} / 5`} />
      </div>
      {phase === "done" && result ? <ResultCard title={dict.common.result} value={formatMs(result)} rating={ratingFor(test, result, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
