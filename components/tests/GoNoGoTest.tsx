"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatPercent } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

type Stimulus = "go" | "no-go" | null;

type Stats = {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctNoGo: number;
};

const totalRounds = 20;

export function GoNoGoTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus>(null);
  const [stats, setStats] = useState<Stats>({ hits: 0, misses: 0, falseAlarms: 0, correctNoGo: 0 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsRef = useRef(stats);
  const roundRef = useRef(0);
  const stimulusRef = useRef<Stimulus>(null);
  const scores = useScores(test.slug);

  const clearTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const finish = (finalStats: Stats) => {
    clearTimer();
    setRunning(false);
    setStimulus(null);
    const correct = finalStats.hits + finalStats.correctNoGo;
    const accuracy = (correct / totalRounds) * 100;
    scores.record(makeStoredScore(test, accuracy));
  };

  const scheduleRound = (nextRound: number) => {
    clearTimer();
    setStimulus(null);
    stimulusRef.current = null;
    setRound(nextRound);
    roundRef.current = nextRound;
    timeoutRef.current = setTimeout(() => {
      const nextStimulus: Stimulus = Math.random() < 0.7 ? "go" : "no-go";
      setStimulus(nextStimulus);
      stimulusRef.current = nextStimulus;
      timeoutRef.current = setTimeout(() => {
        const current = stimulusRef.current;
        const nextStats = { ...statsRef.current };
        if (current === "go") nextStats.misses += 1;
        if (current === "no-go") nextStats.correctNoGo += 1;
        statsRef.current = nextStats;
        setStats(nextStats);
        if (roundRef.current >= totalRounds) finish(nextStats);
        else scheduleRound(roundRef.current + 1);
      }, 900);
    }, randomInt(650, 1500));
  };

  const start = () => {
    const initialStats = { hits: 0, misses: 0, falseAlarms: 0, correctNoGo: 0 };
    statsRef.current = initialStats;
    roundRef.current = 1;
    setStats(initialStats);
    setRunning(true);
    scheduleRound(1);
  };

  const press = () => {
    if (!running || !stimulusRef.current) return;
    const current = stimulusRef.current;
    const nextStats = { ...statsRef.current };
    if (current === "go") nextStats.hits += 1;
    if (current === "no-go") nextStats.falseAlarms += 1;
    statsRef.current = nextStats;
    setStats(nextStats);
    if (roundRef.current >= totalRounds) finish(nextStats);
    else scheduleRound(roundRef.current + 1);
  };

  useEffect(() => clearTimer, []);

  const correct = stats.hits + stats.correctNoGo;
  const accuracy = round ? (correct / Math.min(round, totalRounds)) * 100 : 0;
  const done = !running && round >= totalRounds;

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={press}
        className={`grid min-h-72 w-full place-items-center rounded-lg border p-8 text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
          stimulus === "go"
            ? "border-emerald-300/60 bg-emerald-400/20"
            : stimulus === "no-go"
              ? "border-rose-300/60 bg-rose-400/20"
              : "border-cyan-300/20 bg-slate-950/80"
        }`}
      >
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">{dict.common.rounds}: {Math.min(round, totalRounds)} / {totalRounds}</p>
          <p className="mt-5 text-5xl font-black text-white">
            {stimulus === "go"
              ? locale === "ko" ? "누르세요" : "GO"
              : stimulus === "no-go"
                ? locale === "ko" ? "참으세요" : "NO-GO"
                : running
                  ? locale === "ko" ? "대기" : "Wait"
                  : dict.common.ready}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-300">{locale === "ko" ? "GO일 때만 누르고, NO-GO일 때는 누르지 마세요." : "Press only on GO. Hold back on NO-GO."}</p>
        </div>
      </button>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
        <StatCard label={locale === "ko" ? "정반응" : "Hits"} value={`${stats.hits}`} />
        <StatCard label={locale === "ko" ? "오경보" : "False alarms"} value={`${stats.falseAlarms}`} />
        <StatCard label={locale === "ko" ? "놓침" : "Misses"} value={`${stats.misses}`} />
      </div>
      {done ? <ResultCard title={dict.common.result} value={formatPercent((correct / totalRounds) * 100)} rating={ratingFor(test, (correct / totalRounds) * 100, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
