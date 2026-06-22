"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDictionary } from "@/lib/dictionary";
import { formatScoreValue, NICKNAME_MAX, type LeaderboardEntry, type ScoreType } from "@/lib/leaderboard";
import type { Locale } from "@/lib/locales";
import { useScores } from "@/components/tests/useScores";

type Status = "idle" | "submitting" | "submitted" | "error";

export function Leaderboard({
  slug,
  scoreType,
  locale,
}: {
  slug: string;
  scoreType: ScoreType;
  locale: Locale;
}) {
  const t = getDictionary(locale).leaderboard;
  const { best } = useScores(slug);
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [nickname, setNickname] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const loadedRef = useRef(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/leaderboard/${slug}`, { cache: "no-store" });
      const data = (await res.json()) as { entries?: LeaderboardEntry[] };
      setEntries(data.entries ?? []);
    } catch {
      setEntries([]);
    }
  }, [slug]);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    void load();
  }, [load]);

  const submit = useCallback(async () => {
    const name = nickname.trim();
    if (!best || !name || status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch(`/api/leaderboard/${slug}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nickname: name, value: best.value }),
      });
      if (!res.ok) throw new Error("request failed");
      const data = (await res.json()) as { entries?: LeaderboardEntry[] };
      if (data.entries) setEntries(data.entries);
      setStatus("submitted");
    } catch {
      setStatus("error");
    }
  }, [best, nickname, slug, status]);

  return (
    <section className="rounded-lg border border-cyan-300/20 bg-slate-950/60 p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">{t.title}</h2>
          <p className="mt-1 text-sm text-slate-400">{t.subtitle}</p>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-lg border border-white/10">
        <div className="grid grid-cols-[3rem_1fr_auto] gap-2 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <span>{t.rank}</span>
          <span>{t.player}</span>
          <span className="text-right">{t.score}</span>
        </div>
        {entries === null ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">{t.loading}</p>
        ) : entries.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-slate-400">{t.empty}</p>
        ) : (
          <ul>
            {entries.map((entry, index) => (
              <li
                key={`${entry.nickname}-${index}`}
                className="grid grid-cols-[3rem_1fr_auto] items-center gap-2 border-t border-white/5 px-4 py-2.5 text-sm"
              >
                <span className={`font-black ${index < 3 ? "text-cyan-200" : "text-slate-500"}`}>
                  {index + 1}
                </span>
                <span className="truncate font-semibold text-slate-100">{entry.nickname}</span>
                <span className="text-right font-black text-white">
                  {formatScoreValue(entry.value, scoreType)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
        {best ? (
          status === "submitted" ? (
            <p className="text-sm font-bold text-emerald-300">{t.submitted}</p>
          ) : (
            <div>
              <p className="text-sm text-slate-300">
                {t.yourBest}:{" "}
                <span className="font-black text-white">{formatScoreValue(best.value, scoreType)}</span>
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={nickname}
                  onChange={(event) => setNickname(event.target.value)}
                  maxLength={NICKNAME_MAX}
                  placeholder={t.nicknamePlaceholder}
                  aria-label={t.player}
                  className="flex-1 rounded-md border border-white/15 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
                />
                <button
                  type="button"
                  onClick={submit}
                  disabled={status === "submitting" || nickname.trim().length === 0}
                  className="rounded-md bg-cyan-300 px-5 py-2 text-sm font-black text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {status === "submitting" ? t.submitting : t.submit}
                </button>
              </div>
              {status === "error" && <p className="mt-2 text-sm font-semibold text-rose-300">{t.error}</p>}
            </div>
          )
        ) : (
          <p className="text-sm text-slate-400">{t.noBest}</p>
        )}
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-500">{t.disclaimer}</p>
    </section>
  );
}
