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

export function AudioReactionTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [rounds, setRounds] = useState<number[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef(0);
  const audioRef = useRef<AudioContext | null>(null);
  const scores = useScores(test.slug);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  useEffect(() => resetTimer, []);

  const prepareAudio = async () => {
    if (!audioRef.current) audioRef.current = new AudioContext();
    if (audioRef.current.state === "suspended") await audioRef.current.resume();
  };

  const playBeep = () => {
    const context = audioRef.current;
    if (!context) return;
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.22, context.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  };

  const beginRound = () => {
    resetTimer();
    setPhase("waiting");
    timeoutRef.current = setTimeout(() => {
      startRef.current = performance.now();
      playBeep();
      setPhase("go");
    }, randomInt(1200, 3200));
  };

  const start = async () => {
    await prepareAudio();
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
  const message = {
    idle: locale === "ko" ? "시작 후 소리가 나면 누르세요." : "Start, then press when you hear the beep.",
    waiting: locale === "ko" ? "소리를 기다리세요..." : "Wait for the sound...",
    go: locale === "ko" ? "삐!" : "Beep!",
    tooSoon: locale === "ko" ? "너무 빨랐습니다. 다시 준비하세요." : "Too soon. Get ready again.",
    done: locale === "ko" ? "테스트 완료" : "Test complete",
  }[phase];

  return (
    <div className="space-y-5">
      <button
        type="button"
        onClick={press}
        className={`min-h-72 w-full rounded-lg border p-8 text-center transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
          phase === "go"
            ? "border-emerald-300/60 bg-emerald-400/20"
            : phase === "tooSoon"
              ? "border-rose-300/60 bg-rose-400/20"
              : "border-cyan-300/20 bg-slate-950/80"
        }`}
      >
        <p className="text-sm font-black uppercase tracking-[0.2em] text-cyan-200">{locale === "ko" ? "청각 반응 5회 평균" : "5-Round Audio Average"}</p>
        <p className="mt-4 text-lg font-bold text-slate-300">{dict.common.rounds}: {Math.min(rounds.length + 1, 5)} / 5</p>
        <p className="mt-5 text-4xl font-black text-white sm:text-6xl">{message}</p>
      </button>
      <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={dict.common.average} value={average ? formatMs(average) : "-"} />
        <StatCard label={locale === "ko" ? "최고" : "Best"} value={best ? formatMs(best) : "-"} />
        <StatCard label={locale === "ko" ? "완료 라운드" : "Completed"} value={`${rounds.length}/5`} />
      </div>
      {phase === "done" && average ? <ResultCard title={dict.common.result} value={formatMs(average)} rating={ratingFor(test, average, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
