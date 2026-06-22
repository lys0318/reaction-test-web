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

type Phase = "idle" | "show" | "input" | "done";

function makeNumber(length: number): string {
  return Array.from({ length }, () => randomInt(0, 9)).join("").replace(/^0/, "7");
}

export function NumberMemoryTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(3);
  const [number, setNumber] = useState("");
  const [answer, setAnswer] = useState("");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scores = useScores(test.slug);

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  useEffect(() => clear, []);

  const show = (nextLevel: number) => {
    clear();
    setAnswer("");
    setLevel(nextLevel);
    setNumber(makeNumber(nextLevel));
    setPhase("show");
    timeoutRef.current = setTimeout(() => setPhase("input"), Math.min(3500, 900 + nextLevel * 180));
  };

  const start = () => show(3);

  const submit = () => {
    if (answer.trim() === number) {
      show(level + 1);
    } else {
      const score = Math.max(0, level - 1);
      scores.record(makeStoredScore(test, score));
      setPhase("done");
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid min-h-72 place-items-center rounded-lg border border-cyan-300/20 bg-slate-950/80 p-8 text-center">
        {phase === "show" ? (
          <p className="break-all font-mono text-5xl font-black tracking-widest text-white sm:text-7xl">{number}</p>
        ) : phase === "input" ? (
          <div className="w-full max-w-md">
            <label className="text-sm font-bold text-slate-300" htmlFor="number-answer">
              {locale === "ko" ? "기억한 숫자를 입력하세요" : "Type the number you remember"}
            </label>
            <input
              id="number-answer"
              inputMode="numeric"
              value={answer}
              onChange={(event) => setAnswer(event.target.value.replace(/\D/g, ""))}
              className="mt-3 w-full rounded-lg border border-white/10 bg-black/40 px-4 py-3 text-center font-mono text-3xl font-black text-white outline-none focus:border-cyan-300"
              autoFocus
            />
            <Button className="mt-4 w-full" onClick={submit}>{locale === "ko" ? "확인" : "Submit"}</Button>
          </div>
        ) : (
          <p className="text-3xl font-black text-white">{phase === "done" ? (locale === "ko" ? "게임 종료" : "Game Over") : dict.common.ready}</p>
        )}
      </div>
      <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      <StatCard label={locale === "ko" ? "현재 레벨" : "Current Level"} value={`Lv. ${level}`} />
      {phase === "done" ? <ResultCard title={dict.common.result} value={`Lv. ${Math.max(0, level - 1)}`} rating={ratingFor(test, Math.max(0, level - 1), locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
