"use client";

import { useSearchParams } from "next/navigation";
import type { Locale } from "@/lib/locales";
import { Button } from "./Button";

export function SharedResultNotice({ locale }: { locale: Locale }) {
  const params = useSearchParams();
  const score = params.get("score");
  const tier = params.get("tier");
  const top = params.get("top");

  if (!score) return null;

  return (
    <section className="rounded-lg border border-emerald-300/25 bg-emerald-300/[0.08] p-5">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-emerald-200">
        {locale === "ko" ? "공유된 결과" : "Shared Result"}
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-3xl font-black text-white">{score}</p>
          {tier || top ? <p className="mt-1 text-sm font-bold text-emerald-100">{[tier, top].filter(Boolean).join(" · ")}</p> : null}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            const cleanPath = window.location.pathname;
            window.history.replaceState(null, "", cleanPath);
          }}
        >
          {locale === "ko" ? "공유 표시 숨기기" : "Hide Shared Result"}
        </Button>
      </div>
    </section>
  );
}
