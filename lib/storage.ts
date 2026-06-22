export type StoredScore = {
  value: number;
  label: string;
  createdAt: string;
  higherIsBetter: boolean;
};

const prefix = "testier";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function bestKey(testSlug: string): string {
  return `${prefix}:best:${testSlug}`;
}

function recentKey(testSlug: string): string {
  return `${prefix}:recent:${testSlug}`;
}

export function getBestScore(testSlug: string): StoredScore | null {
  if (!canUseStorage()) return null;
  const raw = window.localStorage.getItem(bestKey(testSlug));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredScore;
  } catch {
    return null;
  }
}

export function setBestScore(testSlug: string, score: StoredScore): StoredScore {
  if (!canUseStorage()) return score;
  const current = getBestScore(testSlug);
  const isBetter =
    !current ||
    (score.higherIsBetter ? score.value > current.value : score.value < current.value);
  if (isBetter) {
    window.localStorage.setItem(bestKey(testSlug), JSON.stringify(score));
    return score;
  }
  return current;
}

export function getRecentScores(testSlug: string): StoredScore[] {
  if (!canUseStorage()) return [];
  const raw = window.localStorage.getItem(recentKey(testSlug));
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as StoredScore[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addRecentScore(testSlug: string, score: StoredScore): StoredScore[] {
  if (!canUseStorage()) return [score];
  const next = [score, ...getRecentScores(testSlug)].slice(0, 12);
  window.localStorage.setItem(recentKey(testSlug), JSON.stringify(next));
  return next;
}

export function clearScores(testSlug: string): void {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(bestKey(testSlug));
  window.localStorage.removeItem(recentKey(testSlug));
}
