"use client";

import type { StoredScore } from "@/lib/storage";

export function ScoreTrend({
  recent,
  title,
  emptyLabel,
}: {
  recent: StoredScore[];
  title: string;
  emptyLabel: string;
}) {
  const points = [...recent].reverse();
  const metrics = points.map((score) => (score.higherIsBetter ? score.value : -score.value));
  const min = metrics.length ? Math.min(...metrics) : 0;
  const max = metrics.length ? Math.max(...metrics) : 1;
  const span = max - min || 1;
  const width = 320;
  const height = 120;
  const chartPoints = points.map((score, index) => {
    const metric = score.higherIsBetter ? score.value : -score.value;
    const x = points.length === 1 ? width / 2 : (index / (points.length - 1)) * width;
    const y = height - ((metric - min) / span) * (height - 18) - 9;
    return { x, y, label: score.label };
  });
  const path = chartPoints.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      {points.length >= 2 ? (
        <div className="mt-4">
          <svg viewBox={`0 0 ${width} ${height}`} className="h-32 w-full overflow-visible" role="img" aria-label={title}>
            <line x1="0" y1="20" x2={width} y2="20" stroke="rgba(148,163,184,0.18)" />
            <line x1="0" y1="60" x2={width} y2="60" stroke="rgba(148,163,184,0.14)" />
            <line x1="0" y1="100" x2={width} y2="100" stroke="rgba(148,163,184,0.18)" />
            <polyline points={path} fill="none" stroke="rgb(34,211,238)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {chartPoints.map((point, index) => (
              <circle key={`${point.label}-${index}`} cx={point.x} cy={point.y} r="4.5" fill="rgb(110,231,183)" stroke="rgb(2,6,23)" strokeWidth="2" />
            ))}
          </svg>
          <div className="mt-2 flex items-center justify-between gap-3 text-xs text-slate-500">
            <span>{points[0]?.label}</span>
            <span>{points.at(-1)?.label}</span>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6 text-slate-400">{emptyLabel}</p>
      )}
    </div>
  );
}
