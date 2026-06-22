"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatMs, formatPercent } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function KeyboardReactionTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [round, setRound] = useState(0);
  const [letter, setLetter] = useState("A");
  const [times, setTimes] = useState<number[]>([]);
  const [wrong, setWrong] = useState(0);
  const shownAt = useRef(0);
  const scores = useScores(test.slug);

  const nextLetter = () => {
    setLetter(letters[randomInt(0, letters.length - 1)]);
    shownAt.current = performance.now();
  };

  const start = () => {
    setRunning(true);
    setRound(1);
    setTimes([]);
    setWrong(0);
    nextLetter();
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!running) return;
      const key = event.key.toUpperCase();
      if (!letters.includes(key)) return;
      if (key === letter) {
        const nextTimes = [...times, performance.now() - shownAt.current];
        setTimes(nextTimes);
        if (round >= 10) {
          const avg = nextTimes.reduce((sum, item) => sum + item, 0) / nextTimes.length;
          scores.record(makeStoredScore(test, avg));
          setRunning(false);
        } else {
          setRound((value) => value + 1);
          nextLetter();
        }
      } else {
        setWrong((value) => value + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [letter, round, running, scores, test, times]);

  const avg = times.length ? times.reduce((sum, item) => sum + item, 0) / times.length : 0;
  const accuracy = times.length + wrong ? (times.length / (times.length + wrong)) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="grid min-h-72 place-items-center rounded-lg border border-cyan-300/20 bg-slate-950/80 p-8 text-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">{dict.common.rounds}: {running ? round : Math.min(round, 10)} / 10</p>
          <p className="mt-4 text-8xl font-black text-white">{running ? letter : "-"}</p>
          <p className="mt-4 text-sm text-slate-400">{locale === "ko" ? "표시된 알파벳 키를 누르세요." : "Press the displayed letter key."}</p>
        </div>
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={dict.common.average} value={avg ? formatMs(avg) : "-"} />
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
        <StatCard label={locale === "ko" ? "오답" : "Wrong"} value={`${wrong}`} />
      </div>
      {!running && times.length >= 10 ? <ResultCard title={dict.common.result} value={formatMs(avg)} rating={ratingFor(test, avg, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
