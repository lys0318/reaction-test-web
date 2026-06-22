import type { Locale } from "./locales";

export type TierKey =
  | "bronze"
  | "silver"
  | "gold"
  | "platinum"
  | "diamond"
  | "master"
  | "champion";

export type Rating = {
  tier: TierKey;
  label: string;
  percentile: string;
  note: string;
};

const tierLabels: Record<Locale, Record<TierKey, string>> = {
  ko: {
    bronze: "브론즈",
    silver: "실버",
    gold: "골드",
    platinum: "플래티넘",
    diamond: "다이아",
    master: "마스터",
    champion: "챔피언",
  },
  en: {
    bronze: "Bronze",
    silver: "Silver",
    gold: "Gold",
    platinum: "Platinum",
    diamond: "Diamond",
    master: "Master",
    champion: "Champion",
  },
};

const notes: Record<Locale, Record<TierKey, string>> = {
  ko: {
    bronze: "기초 구간입니다. 안정적인 반복 연습이 좋아요.",
    silver: "평균보다 조금 더 빠른 감각입니다.",
    gold: "좋은 실전 감각을 보여줍니다.",
    platinum: "상당히 날카로운 기록입니다.",
    diamond: "상위권 반응과 집중력입니다.",
    master: "매우 뛰어난 컨트롤입니다.",
    champion: "최상위권 기록입니다.",
  },
  en: {
    bronze: "A baseline score. Consistent practice will help.",
    silver: "Slightly sharper than average.",
    gold: "Solid real-world performance.",
    platinum: "A very sharp result.",
    diamond: "High-tier speed and focus.",
    master: "Excellent control.",
    champion: "Top-tier performance.",
  },
};

function makeRating(tier: TierKey, percentile: number, locale: Locale): Rating {
  const top = locale === "ko" ? `상위 ${percentile}%` : `Top ${percentile}%`;
  return {
    tier,
    label: tierLabels[locale][tier],
    percentile: top,
    note: notes[locale][tier],
  };
}

function tierFromHigh(value: number, thresholds: number[]): TierKey {
  if (value >= thresholds[6]) return "champion";
  if (value >= thresholds[5]) return "master";
  if (value >= thresholds[4]) return "diamond";
  if (value >= thresholds[3]) return "platinum";
  if (value >= thresholds[2]) return "gold";
  if (value >= thresholds[1]) return "silver";
  return "bronze";
}

function percentileFor(tier: TierKey): number {
  return {
    bronze: 80,
    silver: 60,
    gold: 35,
    platinum: 20,
    diamond: 10,
    master: 5,
    champion: 1,
  }[tier];
}

export function getReactionRating(ms: number, locale: Locale): Rating {
  // Calibrated for browser-measured 5-round averages, which run ~50-100ms
  // higher than native reaction due to display refresh and input latency.
  const tier: TierKey =
    ms <= 180
      ? "champion"
      : ms <= 210
        ? "master"
        : ms <= 240
          ? "diamond"
          : ms <= 270
            ? "platinum"
            : ms <= 310
              ? "gold"
              : ms <= 360
                ? "silver"
                : "bronze";
  return makeRating(tier, percentileFor(tier), locale);
}

export function getCpsRating(cps: number, locale: Locale): Rating {
  const tier = tierFromHigh(cps, [0, 5, 7, 9, 11, 13, 15]);
  return makeRating(tier, percentileFor(tier), locale);
}

export function getAccuracyRating(percent: number, locale: Locale): Rating {
  const tier = tierFromHigh(percent, [0, 55, 70, 82, 90, 96, 99]);
  return makeRating(tier, percentileFor(tier), locale);
}

export function getWpmRating(wpm: number, locale: Locale): Rating {
  const tier = tierFromHigh(wpm, [0, 25, 40, 55, 70, 90, 110]);
  return makeRating(tier, percentileFor(tier), locale);
}

export function getMemoryRating(level: number, locale: Locale): Rating {
  const tier = tierFromHigh(level, [0, 3, 5, 7, 9, 12, 15]);
  return makeRating(tier, percentileFor(tier), locale);
}

export function getScoreRating(score: number, locale: Locale): Rating {
  const tier = tierFromHigh(score, [0, 8, 14, 20, 28, 38, 50]);
  return makeRating(tier, percentileFor(tier), locale);
}
