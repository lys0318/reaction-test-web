"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { formatPercent } from "@/lib/format";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { TimerBar } from "@/components/common/TimerBar";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const colors = [
  { ko: "빨강", en: "RED", className: "text-red-400" },
  { ko: "파랑", en: "BLUE", className: "text-blue-400" },
  { ko: "초록", en: "GREEN", className: "text-emerald-400" },
  { ko: "노랑", en: "YELLOW", className: "text-yellow-300" },
];

export function ColorMatchTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [word, setWord] = useState(0);
  const [ink, setInk] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scores = useScores(test.slug);

  const next = () => {
    setWord(randomInt(0, colors.length - 1));
    setInk(randomInt(0, colors.length - 1));
  };
  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  };
  useEffect(() => () => stop(), []);

  const start = () => {
    stop();
    setCorrect(0);
    setWrong(0);
    setTime(30);
    setFinished(false);
    next();
    setRunning(true);
    let remaining = 30;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTime(remaining);
      if (remaining <= 0) stop();
    }, 1000);
  };

  useEffect(() => {
    if (!running && time <= 0 && !finished) {
      queueMicrotask(() => {
        scores.record(makeStoredScore(test, correct));
        setFinished(true);
      });
    }
  }, [correct, finished, running, scores, test, time]);

  const answer = (match: boolean) => {
    if (!running) return;
    if ((word === ink) === match) setCorrect((value) => value + 1);
    else setWrong((value) => value + 1);
    next();
  };

  const total = correct + wrong;
  const accuracy = total ? (correct / total) * 100 : 0;

  return (
    <div className="space-y-5">
      <TimerBar value={time} max={30} />
      <div className="grid min-h-72 place-items-center rounded-lg border border-cyan-300/20 bg-slate-950/80 p-8 text-center">
        <p className={`text-6xl font-black tracking-widest ${colors[ink].className}`}>{colors[word][locale]}</p>
        <p className="mt-4 text-sm text-slate-400">{running ? `${time}s` : dict.common.ready}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Button onClick={start} variant="secondary">{running ? dict.common.restart : dict.common.start}</Button>
        <Button onClick={() => answer(true)} disabled={!running}>{locale === "ko" ? "일치" : "Match"}</Button>
        <Button onClick={() => answer(false)} disabled={!running} variant="ghost">{locale === "ko" ? "불일치" : "No Match"}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={locale === "ko" ? "정답" : "Correct"} value={`${correct}`} />
        <StatCard label={locale === "ko" ? "오답" : "Wrong"} value={`${wrong}`} />
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
      </div>
      {finished ? <ResultCard title={dict.common.result} value={`${correct}`} rating={ratingFor(test, correct, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
