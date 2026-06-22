import type { TestDefinition } from "./tests";

// Pure, client-safe leaderboard helpers (no server/D1 imports here).

export type ScoreType = TestDefinition["scoreType"];

export type LeaderboardEntry = {
  nickname: string;
  value: number;
};

export const NICKNAME_MAX = 20;

// Plausibility bounds per score type. Values outside these are rejected
// server-side as impossible / not leaderboard-worthy (basic anti-cheat).
const BOUNDS: Record<ScoreType, { min: number; max: number }> = {
  reaction: { min: 80, max: 2000 }, // ms; sub-80ms is not humanly possible
  cps: { min: 0.1, max: 25 },
  accuracy: { min: 0, max: 100 },
  wpm: { min: 1, max: 400 },
  memory: { min: 1, max: 100 },
  score: { min: 0, max: 100000 },
};

export function cleanNickname(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const cleaned = raw
    .replace(/\p{Cc}/gu, "") // strip control characters
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, NICKNAME_MAX);
  return cleaned.length >= 1 ? cleaned : null;
}

export function validateValue(raw: unknown, scoreType: ScoreType): number | null {
  const n = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(n)) return null;
  const { min, max } = BOUNDS[scoreType];
  if (n < min || n > max) return null;
  return Math.round(n * 100) / 100;
}

export function formatScoreValue(value: number, scoreType: ScoreType): string {
  switch (scoreType) {
    case "reaction":
      return `${Math.round(value)} ms`;
    case "cps":
      return `${value.toFixed(1)} CPS`;
    case "accuracy":
      return `${Math.round(value)}%`;
    case "wpm":
      return `${Math.round(value)} WPM`;
    case "memory":
      return `Lv ${Math.round(value)}`;
    default:
      return `${Math.round(value)}`;
  }
}
