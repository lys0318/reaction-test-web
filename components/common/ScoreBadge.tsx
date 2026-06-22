import type { Rating, TierKey } from "@/lib/scoring";

const colors: Record<TierKey, string> = {
  bronze: "border-amber-700/50 bg-amber-950/60 text-amber-200",
  silver: "border-slate-300/30 bg-slate-400/10 text-slate-100",
  gold: "border-yellow-300/40 bg-yellow-400/10 text-yellow-100",
  platinum: "border-teal-200/40 bg-teal-300/10 text-teal-100",
  diamond: "border-sky-200/50 bg-sky-300/10 text-sky-100",
  master: "border-violet-200/50 bg-violet-300/10 text-violet-100",
  champion: "border-emerald-200/50 bg-emerald-300/10 text-emerald-100",
};

export function ScoreBadge({ rating }: { rating: Rating }) {
  return (
    <div className={`inline-flex flex-col rounded-lg border px-4 py-3 ${colors[rating.tier]}`}>
      <span className="text-xs font-black uppercase tracking-[0.22em]">{rating.percentile}</span>
      <span className="text-xl font-black">{rating.label}</span>
      <span className="mt-1 max-w-xs text-xs opacity-85">{rating.note}</span>
    </div>
  );
}
