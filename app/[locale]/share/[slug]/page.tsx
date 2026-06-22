import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { isLocale, type Locale } from "@/lib/locales";
import { publicSiteUrl } from "@/lib/seo";
import { getTest, tests } from "@/lib/tests";

type ShareParams = Promise<{ locale: string; slug: string }>;
type ShareSearch = Promise<{ score?: string | string[]; tier?: string | string[]; top?: string | string[] }>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function ogImagePath(locale: Locale, score: string, tier: string, top: string) {
  const params = new URLSearchParams({ locale, score, tier, top });
  return `/api/og/result?${params.toString()}`;
}

function ogImageUrl(locale: Locale, score: string, tier: string, top: string) {
  return `${publicSiteUrl}${ogImagePath(locale, score, tier, top)}`;
}

export function generateStaticParams() {
  return tests.map((test) => ({ slug: test.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: ShareParams;
  searchParams: ShareSearch;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const test = getTest(slug);
  if (!test) return {};
  const search = await searchParams;
  const score = first(search.score) || (locale === "ko" ? "결과" : "Result");
  const tier = first(search.tier) || (locale === "ko" ? "티어" : "Tier");
  const top = first(search.top) || "";
  const title = locale === "ko" ? `Testier 결과: ${score} · ${tier}` : `Testier result: ${score} · ${tier}`;
  const description = locale === "ko" ? `${test.title.ko} 결과를 확인하고 내 기록과 비교해 보세요.` : `View this ${test.title.en} result and compare your own score.`;
  const image = ogImageUrl(locale, score, tier, top);

  return {
    metadataBase: new URL(publicSiteUrl),
    title,
    description,
    alternates: {
      canonical: `/${locale}/share/${slug}`,
    },
    openGraph: {
      title,
      description,
      siteName: "Testier",
      type: "website",
      url: `${publicSiteUrl}/${locale}/share/${slug}`,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function SharePage({
  params,
  searchParams,
}: {
  params: ShareParams;
  searchParams: ShareSearch;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const test = getTest(slug);
  if (!test) notFound();
  const search = await searchParams;
  const score = first(search.score) || "-";
  const tier = first(search.tier) || "-";
  const top = first(search.top) || "-";
  const image = ogImagePath(locale, score, tier, top);

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-4xl">
        <div className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-6">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-cyan-200">{locale === "ko" ? "공유된 결과" : "Shared Result"}</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-white">{test.title[locale]}</h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{locale === "ko" ? "점수" : "Score"}</p>
              <p className="mt-2 text-3xl font-black text-white">{score}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{locale === "ko" ? "티어" : "Tier"}</p>
              <p className="mt-2 text-3xl font-black text-white">{tier}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{locale === "ko" ? "분포" : "Percentile"}</p>
              <p className="mt-2 text-3xl font-black text-white">{top}</p>
            </div>
          </div>
          <p className="mt-6 text-sm leading-7 text-slate-300">
            {locale === "ko"
              ? "이 링크는 결과 값을 URL에 담아 보여줍니다. 서버에 개인 기록을 저장하지 않으며, 같은 테스트를 다시 플레이해 내 기록과 비교할 수 있습니다."
              : "This link displays result values from the URL. Testier does not store personal results on a server, and you can replay the same test to compare your own score."}
          </p>
          <div className="mt-6 overflow-hidden rounded-lg border border-white/10 bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={locale === "ko" ? "결과 공유 이미지" : "Result share image"} className="w-full" />
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/${locale}/tests/${slug}`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 text-sm font-black text-slate-950 hover:bg-cyan-300"
            >
              {locale === "ko" ? "같은 테스트 해보기" : "Try This Test"}
            </Link>
            <Link
              href={`/${locale}/tests`}
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/10 px-5 py-3 text-sm font-bold text-slate-200 hover:bg-white/[0.06]"
            >
              {locale === "ko" ? "다른 테스트 보기" : "Browse Tests"}
            </Link>
          </div>
        </div>
      </article>
    </Container>
  );
}
