"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { Button } from "@/components/common/Button";
import { ResultCard } from "@/components/common/ResultCard";
import { StatCard } from "@/components/common/StatCard";
import { ScoreHistory } from "./ScoreHistory";
import { makeStoredScore, randomInt, ratingFor } from "./helpers";
import { useScores } from "./useScores";

const pads = ["cyan", "emerald", "violet", "amber"] as const;
const padClasses = {
  cyan: "bg-cyan-400",
  emerald: "bg-emerald-400",
  violet: "bg-violet-400",
  amber: "bg-amber-300",
};

export function SequenceMemoryTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [sequence, setSequence] = useState<number[]>([]);
  const [input, setInput] = useState(0);
  const [active, setActive] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const scores = useScores(test.slug);

  const clear = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };
  useEffect(() => () => clear(), []);

  const play = (next: number[]) => {
    clear();
    setPlaying(true);
    setInput(0);
    next.forEach((item, index) => {
      timers.current.push(setTimeout(() => setActive(item), 450 + index * 620));
      timers.current.push(setTimeout(() => setActive(null), 760 + index * 620));
    });
    timers.current.push(setTimeout(() => setPlaying(false), 900 + next.length * 620));
  };

  const start = () => {
    const next = [randomInt(0, 3)];
    setDone(false);
    setSequence(next);
    play(next);
  };

  const press = (index: number) => {
    if (playing || done || sequence.length === 0) return;
    setActive(index);
    setTimeout(() => setActive(null), 160);
    if (sequence[input] !== index) {
      scores.record(makeStoredScore(test, Math.max(0, sequence.length - 1)));
      setDone(true);
      return;
    }
    if (input === sequence.length - 1) {
      const next = [...sequence, randomInt(0, 3)];
      setSequence(next);
      play(next);
    } else {
      setInput((value) => value + 1);
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-4">
        <div className="mx-auto grid max-w-[min(72vw,360px)] grid-cols-2 gap-3 sm:max-w-sm">
          {pads.map((pad, index) => (
            <button
              key={pad}
              type="button"
              onClick={() => press(index)}
              className={`aspect-square min-h-0 rounded-lg border border-white/15 ${padClasses[pad]} transition focus:outline-none focus:ring-2 focus:ring-white ${
                active === index ? "scale-[0.98] opacity-100 shadow-[0_0_34px_rgba(255,255,255,0.55)]" : "opacity-45"
              }`}
              aria-label={`${pad} pad`}
            />
          ))}
        </div>
      </div>
      <Button onClick={start}>{sequence.length ? dict.common.restart : dict.common.start}</Button>
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard label={locale === "ko" ? "레벨" : "Level"} value={`Lv. ${sequence.length}`} />
        <StatCard label={locale === "ko" ? "입력 순서" : "Input"} value={`${input} / ${sequence.length}`} />
      </div>
      {done ? <ResultCard title={dict.common.result} value={`Lv. ${Math.max(0, sequence.length - 1)}`} rating={ratingFor(test, Math.max(0, sequence.length - 1), locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
