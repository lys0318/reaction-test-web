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

type Phase = "idle" | "waiting" | "go" | "tooSoon" | "done";

export function ReactionTimeTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);
  const scores = useScores(test.slug);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => resetTimer, []);

  const beginRound = () => {
    resetTimer();
    setPhase("waiting");
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase("go");
    }, randomInt(900, 2800));
  };

  const start = () => {
    setRounds([]);
    beginRound();
  };

  const press = () => {
    if (phase === "idle" || phase === "done") return;
    if (phase === "waiting") {
      resetTimer();
      setPhase("tooSoon");
      return;
    }
    if (phase === "tooSoon") {
      beginRound();
      return;
    }
    const ms = performance.now() - startRef.current;
    const next = [...rounds, ms];
    setRounds(next);
    if (next.length >= 5) {
      const avg = next.reduce((sum, item) => sum + item, 0) / next.length;
      scores.record(makeStoredScore(test, avg));
      setPhase("done");
    } else {
      beginRound();
    }
  };

  const average = rounds.length ? rounds.reduce((sum, item) => sum + item, 0) / rounds.length : 0;
  const best = rounds.length ? Math.min(...rounds) : 0;
  const worst = rounds.length ? Math.max(...rounds) : 0;
  const rating = average ? ratingFor(test, average, locale) : undefined;

  const message = {
    idle: locale === "ko" ? "시작을 누르면 5라운드 테스트가 시작됩니다." : "Press start to begin 5 rounds.",
    waiting: locale === "ko" ? "기다리세요... 색이 바뀌면 누르세요." : "Wait... click when the color changes.",
    go: locale === "ko" ? "지금!" : "Now!",
    tooSoon: locale === "ko" ? "너무 빨랐습니다. 다시 준비하세요." : "Too soon. Get ready again.",
    done: locale === "ko" ? "테스트 완료" : "Test complete",
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
        className={`min-h-72 w-full select-none rounded-lg border p-8 text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
          phase === "go"
            ? "border-emerald-300/60 bg-emerald-400/20"
            : phase === "tooSoon"
              ? "border-rose-300/60 bg-rose-400/20"
              : "border-cyan-300/20 bg-slate-950/80"
        }`}
        aria-label={message}
      >
        <p className="mx-auto inline-flex rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
          {locale === "ko" ? "5회 평균 모드" : "5-Round Average Mode"}
        </p>
        <p className="text-lg font-bold text-slate-300">{dict.common.rounds}: {Math.min(rounds.length + 1, 5)} / 5</p>
        <p className="mt-5 text-4xl font-black text-white sm:text-6xl">{message}</p>
      </button>
      <div className="flex flex-wrap gap-3">
        <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={dict.common.average} value={average ? formatMs(average) : "-"} />
        <StatCard label={locale === "ko" ? "최고" : "Best"} value={best ? formatMs(best) : "-"} />
        <StatCard label={locale === "ko" ? "최저" : "Worst"} value={worst ? formatMs(worst) : "-"} />
      </div>
      {rounds.length ? (
        <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{locale === "ko" ? "라운드별 기록" : "Round Results"}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-5">
            {rounds.map((round, index) => (
              <div key={`${round}-${index}`} className="rounded-md bg-slate-950/65 px-3 py-2 text-center">
                <p className="text-xs text-slate-500">{index + 1}</p>
                <p className="text-sm font-black text-white">{formatMs(round)}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {phase === "done" && average ? (
        <ResultCard title={dict.common.result} value={formatMs(average)} rating={rating}>
          <p className="text-sm leading-6 text-slate-300">
            {locale === "ko"
              ? "최종 티어는 5회 평균으로 계산됩니다. 단발 클릭보다 평균과 편차를 함께 보는 것이 더 공정합니다."
              : "The final tier is based on your 5-round average. Average and spread are fairer than a single lucky click."}
          </p>
        </ResultCard>
      ) : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
