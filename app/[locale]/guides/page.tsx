import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { SectionTitle } from "@/components/common/SectionTitle";
import { guides } from "@/lib/guides";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  return buildMetadata({
    locale,
    path: `/${locale}/guides`,
    title: locale === "ko" ? "Testier 가이드 - 반응속도와 테스트 해설" : "Testier Guides - Reaction and Test Articles",
    description:
      locale === "ko"
        ? "반응속도 평균, 프로게이머 기준, 주사율과 입력 지연, F1 스타트 반응 차이를 설명하는 Testier 가이드입니다."
        : "Guides about reaction averages, pro-gamer ranges, refresh rate, input lag, and F1-style starts.",
  });
}

export default async function GuidesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <Container className="py-12">
      <SectionTitle
        title={locale === "ko" ? "반응속도와 테스트 가이드" : "Reaction and Test Guides"}
        description={
          locale === "ko"
            ? "테스트 결과를 더 정확하게 해석할 수 있도록 평균, 장비 지연, 프로게이머급 기록, 연습 루틴을 정리했습니다."
            : "Understand averages, device latency, pro-level ranges, and practice routines so your test results make more sense."
        }
      />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/${locale}/guides/${guide.slug}`} className="rounded-lg border border-white/10 bg-white/[0.035] p-5 transition hover:border-cyan-300/35 hover:bg-cyan-300/[0.05]">
            <h2 className="text-xl font-black text-white">{guide.title[locale]}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">{guide.description[locale]}</p>
          </Link>
        ))}
      </div>
    </Container>
  );
}
