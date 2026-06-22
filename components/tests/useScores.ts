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

export function useScores(slug: string) {
  const [best, setBest] = useState<StoredScore | null>(null);
  const [recent, setRecent] = useState<StoredScore[]>([]);

  const refresh = useCallback(() => {
    setBest(getBestScore(slug));
    setRecent(getRecentScores(slug));
  }, [slug]);

  useEffect(() => {
    queueMicrotask(refresh);
  }, [refresh]);

  const record = useCallback(
    (score: StoredScore) => {
      const nextBest = setBestScore(slug, score);
      const nextRecent = addRecentScore(slug, score);
      setBest(nextBest);
      setRecent(nextRecent);
    },
    [slug]
  );

  const clear = useCallback(() => {
    clearScores(slug);
    refresh();
  }, [refresh, slug]);

  return { best, recent, record, clear };
}
