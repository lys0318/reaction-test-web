export function TimerBar({ value, max }: { value: number; max: number }) {
  const width = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2 overflow-hidden rounded-full bg-slate-800" aria-hidden="true">
      <div
        className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-violet-300 transition-all"
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
