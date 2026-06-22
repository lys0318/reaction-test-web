"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { Rating } from "@/lib/scoring";
import { Button } from "./Button";
import { ScoreBadge } from "./ScoreBadge";

export function ResultCard({
  title,
  value,
  rating,
  children,
}: {
  title: string;
  value: string;
  rating?: Rating;
  children?: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (value && value !== "-") {
      queueMicrotask(() => setOpen(true));
    }
  }, [value]);

  const locale = pathname.startsWith("/ko") ? "ko" : "en";
  const pathParts = pathname.split("/").filter(Boolean);
  const testSlug = pathParts[1] === "tests" ? pathParts[2] : pathParts.at(-1) || "reaction-time";
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({
      score: value,
      tier: rating?.label || "",
      top: rating?.percentile || "",
    });
    return `${window.location.origin}/${locale}/share/${testSlug}?${params.toString()}`;
  }, [locale, rating?.label, rating?.percentile, testSlug, value]);

  const imageUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    const params = new URLSearchParams({
      locale,
      score: value,
      tier: rating?.label || "",
      top: rating?.percentile || "",
    });
    return `${window.location.origin}/api/og/result?${params.toString()}`;
  }, [locale, rating?.label, rating?.percentile, value]);

  const copyShareUrl = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const nativeShare = async () => {
    if (!shareUrl) return;
    if (navigator.share) {
      await navigator.share({
        title: locale === "ko" ? `테스티어 결과: ${value}` : `Testier result: ${value}`,
        text: rating ? `${rating.label} · ${rating.percentile}` : value,
        url: shareUrl,
      });
    } else {
      await copyShareUrl();
    }
  };

  return (
    <>
      <section className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5 shadow-[0_0_36px_rgba(34,211,238,0.08)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">{title}</p>
            <p className="mt-2 text-4xl font-black tracking-tight text-white">{value}</p>
          </div>
          {rating ? <ScoreBadge rating={rating} /> : null}
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button type="button" onClick={copyShareUrl} variant="secondary">
            {copied ? (locale === "ko" ? "복사 완료" : "Copied") : locale === "ko" ? "결과 링크 복사" : "Copy Result Link"}
          </Button>
          <Button type="button" onClick={nativeShare} variant="ghost">
            {locale === "ko" ? "공유하기" : "Share"}
          </Button>
        </div>
        {children ? <div className="mt-5">{children}</div> : null}
      </section>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/78 px-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={locale === "ko" ? "테스트 결과" : "Test result"}>
          <div className="w-full max-w-lg rounded-lg border border-cyan-300/25 bg-slate-950 p-5 shadow-[0_0_60px_rgba(34,211,238,0.2)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">{locale === "ko" ? "테스트 완료" : "Test Complete"}</p>
                <h2 className="mt-2 text-3xl font-black tracking-tight text-white">{value}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-white/10 px-3 py-2 text-sm font-bold text-slate-200 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-cyan-300"
                aria-label={locale === "ko" ? "결과 팝업 닫기" : "Close result popup"}
              >
                X
              </button>
            </div>
            {rating ? <div className="mt-5"><ScoreBadge rating={rating} /></div> : null}
            <p className="mt-5 text-sm leading-6 text-slate-300">
              {locale === "ko"
                ? "이 결과를 링크로 공유할 수 있습니다. 공유 링크를 받은 사람은 같은 테스트 페이지에서 점수와 티어를 확인할 수 있어요."
                : "You can share this result as a link. Anyone opening it can see the score and tier on the same test page."}
            </p>
            <div className="mt-5 rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-slate-300 break-all">{shareUrl}</div>
            {imageUrl ? (
              <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-black/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl} alt={locale === "ko" ? "공유 이미지 미리보기" : "Share image preview"} className="w-full" />
              </div>
            ) : null}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Button type="button" onClick={copyShareUrl}>
                {copied ? (locale === "ko" ? "복사 완료" : "Copied") : locale === "ko" ? "링크 복사" : "Copy Link"}
              </Button>
              <Button type="button" onClick={nativeShare} variant="secondary">
                {locale === "ko" ? "공유하기" : "Share"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
