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

type Phase = "idle" | "waiting" | "target" | "miss" | "done";

export function FPSReactionTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);
  const scores = useScores(test.slug);

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  useEffect(() => clear, []);

  const queueTarget = () => {
    clear();
    setPhase("waiting");
    timeoutRef.current = setTimeout(() => {
      setTarget({ x: randomInt(14, 86), y: randomInt(18, 82) });
      startRef.current = performance.now();
      setPhase("target");
    }, randomInt(700, 2200));
  };

  const start = () => {
    setRounds([]);
    queueTarget();
  };

  const miss = () => {
    if (phase === "waiting") {
      clear();
      setPhase("miss");
    }
  };

  const hit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (phase !== "target") return;
    const ms = performance.now() - startRef.current;
    const next = [...rounds, ms];
    setRounds(next);
    if (next.length >= 5) {
      const avg = next.reduce((sum, item) => sum + item, 0) / next.length;
      scores.record(makeStoredScore(test, avg));
      setPhase("done");
    } else {
      queueTarget();
    }
  };

  const avg = rounds.length ? rounds.reduce((sum, item) => sum + item, 0) / rounds.length : 0;

  return (
    <div className="space-y-5">
      <div
        role="button"
        tabIndex={0}
        onClick={miss}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") miss();
        }}
        className="relative min-h-80 select-none overflow-hidden rounded-lg border border-cyan-300/20 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(2,6,23,0.92)_48%)] p-4 focus:outline-none focus:ring-2 focus:ring-cyan-300"
        aria-label={locale === "ko" ? "FPS 반응속도 테스트 영역" : "FPS reaction test area"}
      >
        <p className="absolute left-4 top-4 text-sm font-bold text-slate-300">{dict.common.rounds}: {Math.min(rounds.length + 1, 5)} / 5</p>
        {phase === "target" ? (
          <button
            type="button"
            onClick={hit}
            className="absolute h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-emerald-300 shadow-[0_0_30px_rgba(110,231,183,0.75)] focus:outline-none focus:ring-4 focus:ring-emerald-100"
            style={{ left: `${target.x}%`, top: `${target.y}%` }}
            aria-label={locale === "ko" ? "타깃 클릭" : "Click target"}
          />
        ) : (
          <div className="grid h-72 place-items-center text-center">
            <p className="text-3xl font-black text-white">
              {phase === "idle"
                ? dict.common.ready
                : phase === "waiting"
                  ? locale === "ko" ? "타깃 대기 중..." : "Waiting for target..."
                  : phase === "miss"
                    ? locale === "ko" ? "조기 클릭입니다" : "Early click"
                    : locale === "ko" ? "완료" : "Complete"}
            </p>
          </div>
        )}
      </div>
      <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      <StatCard label={dict.common.average} value={avg ? formatMs(avg) : "-"} />
      {phase === "done" && avg ? <ResultCard title={dict.common.result} value={formatMs(avg)} rating={ratingFor(test, avg, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
