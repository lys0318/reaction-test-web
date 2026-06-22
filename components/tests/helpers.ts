import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import {
  getAccuracyRating,
  getCpsRating,
  getMemoryRating,
  getReactionRating,
  getScoreRating,
  getWpmRating,
  type Rating,
} from "@/lib/scoring";
import { formatMs, formatNumber, formatPercent, formatWpm } from "@/lib/format";
import type { StoredScore } from "@/lib/storage";

export function ratingFor(test: TestDefinition, value: number, locale: Locale): Rating {
  if (test.scoreType === "reaction") return getReactionRating(value, locale);
  if (test.scoreType === "cps") return getCpsRating(value, locale);
  if (test.scoreType === "accuracy") return getAccuracyRating(value, locale);
  if (test.scoreType === "wpm") return getWpmRating(value, locale);
  if (test.scoreType === "memory") return getMemoryRating(value, locale);
  return getScoreRating(value, locale);
}

export function labelFor(test: TestDefinition, value: number): string {
  if (test.scoreType === "reaction") return formatMs(value);
  if (test.scoreType === "cps") return `${formatNumber(value, 1)} CPS`;
  if (test.scoreType === "accuracy") return formatPercent(value);
  if (test.scoreType === "wpm") return formatWpm(value);
  if (test.scoreType === "memory") return `Lv. ${Math.round(value)}`;
  return formatNumber(value);
}

export function makeStoredScore(test: TestDefinition, value: number): StoredScore {
  return {
    value,
    label: labelFor(test, value),
    createdAt: new Date().toISOString(),
    higherIsBetter: test.higherIsBetter,
  };
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
