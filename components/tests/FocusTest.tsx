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

const shapes = ["◆", "●", "■", "▲"];
const colors = ["text-cyan-300", "text-emerald-300", "text-violet-300", "text-amber-300"];

type Item = { shape: string; color: string; target: boolean; x: number; y: number };

export function FocusTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [running, setRunning] = useState(false);
  const [time, setTime] = useState(30);
  const [targetShape, setTargetShape] = useState("◆");
  const [targetColor, setTargetColor] = useState(colors[0]);
  const [items, setItems] = useState<Item[]>([]);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scores = useScores(test.slug);

  const buildItems = (remaining: number, shape = targetShape, color = targetColor) => {
    const count = remaining > 20 ? 10 : remaining > 10 ? 14 : 18;
    const nextItems = Array.from({ length: count }, (_, index) => {
      const isTarget = index < Math.max(2, Math.floor(count / 4));
      return {
        shape: isTarget ? shape : shapes[randomInt(0, shapes.length - 1)],
        color: isTarget ? color : colors[randomInt(0, colors.length - 1)],
        target: isTarget,
        x: randomInt(8, 88),
        y: randomInt(14, 84),
      };
    }).sort(() => Math.random() - 0.5);
    setItems(nextItems);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setRunning(false);
  };
  useEffect(() => () => stop(), []);

  const start = () => {
    stop();
    const shape = shapes[randomInt(0, shapes.length - 1)];
    const color = colors[randomInt(0, colors.length - 1)];
    setTargetShape(shape);
    setTargetColor(color);
    setCorrect(0);
    setWrong(0);
    setTime(30);
    setFinished(false);
    setRunning(true);
    buildItems(30, shape, color);
    let remaining = 30;
    intervalRef.current = setInterval(() => {
      remaining -= 1;
      setTime(remaining);
      buildItems(remaining, shape, color);
      if (remaining <= 0) stop();
    }, 1000);
  };

  useEffect(() => {
    if (!running && time <= 0 && !finished) {
      queueMicrotask(() => {
        const nextScore = Math.max(0, correct * 2 - wrong);
        scores.record(makeStoredScore(test, nextScore));
        setFinished(true);
      });
    }
  }, [correct, finished, running, scores, test, time, wrong]);

  const press = (item: Item) => {
    if (!running) return;
    if (item.target) setCorrect((value) => value + 1);
    else setWrong((value) => value + 1);
  };

  const total = correct + wrong;
  const accuracy = total ? (correct / total) * 100 : 0;
  const score = Math.max(0, correct * 2 - wrong);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4">
        <p className="text-sm font-bold text-slate-300">{locale === "ko" ? "타깃만 클릭" : "Click only target"}:</p>
        <p className={`text-4xl font-black ${targetColor}`}>{targetShape}</p>
      </div>
      <TimerBar value={time} max={30} />
      <div className="relative min-h-96 overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950/80">
        {running ? items.map((item, index) => (
          <button
            key={`${item.x}-${item.y}-${index}`}
            type="button"
            onClick={() => press(item)}
            className={`absolute -translate-x-1/2 -translate-y-1/2 text-4xl font-black ${item.color} focus:outline-none focus:ring-2 focus:ring-cyan-300`}
            style={{ left: `${item.x}%`, top: `${item.y}%` }}
            aria-label={item.target ? "target" : "distractor"}
          >
            {item.shape}
          </button>
        )) : (
          <div className="grid h-96 place-items-center text-3xl font-black text-white">{dict.common.ready}</div>
        )}
      </div>
      <Button onClick={start}>{running ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard label={locale === "ko" ? "정답" : "Correct"} value={`${correct}`} />
        <StatCard label={locale === "ko" ? "오답" : "Wrong"} value={`${wrong}`} />
        <StatCard label={dict.common.accuracy} value={formatPercent(accuracy)} />
        <StatCard label={dict.common.score} value={`${score}`} />
      </div>
      {finished ? <ResultCard title={dict.common.result} value={`${score}`} rating={ratingFor(test, score, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
