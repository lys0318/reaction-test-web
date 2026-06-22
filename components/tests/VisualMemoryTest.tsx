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

type Phase = "idle" | "show" | "pick" | "done";

export function VisualMemoryTest({ locale, test }: { locale: Locale; test: TestDefinition }) {
  const dict = getDictionary(locale);
  const [phase, setPhase] = useState<Phase>("idle");
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState(3);
  const [targets, setTargets] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scores = useScores(test.slug);

  const clear = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
  useEffect(() => clear, []);

  const makeTargets = (size: number, count: number) => {
    const picked = new Set<number>();
    while (picked.size < count) picked.add(randomInt(0, size * size - 1));
    return Array.from(picked);
  };

  const show = (nextLevel: number) => {
    clear();
    const nextGrid = nextLevel < 4 ? 3 : nextLevel < 8 ? 4 : 5;
    setGrid(nextGrid);
    setLevel(nextLevel);
    setSelected([]);
    setTargets(makeTargets(nextGrid, Math.min(nextGrid * nextGrid - 1, nextLevel + 2)));
    setPhase("show");
    timeoutRef.current = setTimeout(() => setPhase("pick"), 1000 + nextLevel * 140);
  };

  const start = () => {
    setMistakes(0);
    show(1);
  };

  const pick = (index: number) => {
    if (phase !== "pick" || selected.includes(index)) return;
    if (!targets.includes(index)) {
      setMistakes((value) => value + 1);
      scores.record(makeStoredScore(test, level - 1));
      setPhase("done");
      return;
    }
    const next = [...selected, index];
    setSelected(next);
    if (next.length === targets.length) show(level + 1);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-4">
        <div className="mx-auto grid max-w-md gap-2" style={{ gridTemplateColumns: `repeat(${grid}, minmax(0, 1fr))` }}>
          {Array.from({ length: grid * grid }, (_, index) => {
            const highlighted = phase === "show" && targets.includes(index);
            const active = selected.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => pick(index)}
                className={`aspect-square rounded-lg border transition focus:outline-none focus:ring-2 focus:ring-cyan-300 ${
                  highlighted || active
                    ? "border-emerald-200 bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.45)]"
                    : "border-white/10 bg-white/[0.05] hover:bg-white/[0.09]"
                }`}
                aria-label={`${locale === "ko" ? "타일" : "Tile"} ${index + 1}`}
              />
            );
          })}
        </div>
      </div>
      <Button onClick={start}>{phase === "idle" ? dict.common.start : dict.common.restart}</Button>
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label={locale === "ko" ? "레벨" : "Level"} value={`Lv. ${level}`} />
        <StatCard label={locale === "ko" ? "정답 타일" : "Target Tiles"} value={`${targets.length}`} />
        <StatCard label={dict.common.misses} value={`${mistakes}`} />
      </div>
      {phase === "done" ? <ResultCard title={dict.common.result} value={`Lv. ${level - 1}`} rating={ratingFor(test, level - 1, locale)} /> : null}
      <ScoreHistory locale={locale} best={scores.best} recent={scores.recent} onClear={scores.clear} />
    </div>
  );
}
