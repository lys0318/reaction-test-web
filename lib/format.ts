export function formatMs(value: number): string {
  return `${Math.round(value)} ms`;
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatNumber(value: number, digits = 0): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

export function formatWpm(value: number): string {
  return `${Math.round(value)} WPM`;
}
