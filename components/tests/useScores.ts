"use client";

import { useCallback, useEffect, useState } from "react";
import {
  addRecentScore,
  clearScores,
  getBestScore,
  getRecentScores,
  setBestScore,
  type StoredScore,
} from "@/lib/storage";

// Fired whenever scores change so every useScores instance for the same slug
// (e.g. the test itself and the Leaderboard panel) stays in sync without a
// page refresh.
const SCORES_EVENT = "testier:scores";

export function useScores(slug: string) {
  const [best, setBest] = useState<StoredScore | null>(null);
  const [recent, setRecent] = useState<StoredScore[]>([]);

  const refresh = useCallback(() => {
    setBest(getBestScore(slug));
    setRecent(getRecentScores(slug));
  }, [slug]);

  useEffect(() => {
    queueMicrotask(refresh);
    const onUpdate = (event: Event) => {
      const detail = (event as CustomEvent<{ slug?: string }>).detail;
      if (!detail || detail.slug === slug) refresh();
    };
    window.addEventListener(SCORES_EVENT, onUpdate);
    return () => window.removeEventListener(SCORES_EVENT, onUpdate);
  }, [refresh, slug]);

  const record = useCallback(
    (score: StoredScore) => {
      const nextBest = setBestScore(slug, score);
      const nextRecent = addRecentScore(slug, score);
      setBest(nextBest);
      setRecent(nextRecent);
      window.dispatchEvent(new CustomEvent(SCORES_EVENT, { detail: { slug } }));
    },
    [slug]
  );

  const clear = useCallback(() => {
    clearScores(slug);
    refresh();
    window.dispatchEvent(new CustomEvent(SCORES_EVENT, { detail: { slug } }));
  }, [refresh, slug]);

  return { best, recent, record, clear };
}
