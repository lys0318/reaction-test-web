import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { Container } from "@/components/common/Container";
import { LinkButton } from "@/components/common/Button";
import { SectionTitle } from "@/components/common/SectionTitle";
import { TestCard } from "@/components/tests/TestCard";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";
import { categoryLabels, tests } from "@/lib/tests";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/${locale}`,
    title: locale === "ko" ? "Testier - 테스트하고 티어로 확인하세요" : "Testier - Test Yourself and Discover Your Tier",
    description: dict.tagline,
  });
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  const popular = tests.slice(0, 6);

  return (
    <Container className="py-10 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
        <div>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">{dict.home.title}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{dict.home.description}</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <LinkButton href={`/${locale}/tests/reaction-time`}>{dict.home.primaryCta}</LinkButton>
            <LinkButton href={`/${locale}/tests`} variant="secondary">{dict.home.secondaryCta}</LinkButton>
          </div>
        </div>
        <div className="rounded-lg border border-cyan-300/20 bg-slate-950/80 p-5 shadow-[0_0_60px_rgba(34,211,238,0.12)]">
          <div className="flex items-center justify-between text-sm font-bold text-slate-300">
            <span>{tests[0].title[locale]}</span>
            <span className="text-cyan-200">Champion · Top 1%</span>
          </div>
          <div className="mt-5 grid min-h-64 place-items-center rounded-lg border border-emerald-300/30 bg-emerald-300/[0.08] text-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-emerald-200">Ready Signal</p>
              <p className="mt-4 text-6xl font-black text-white">184 ms</p>
              <p className="mt-3 text-sm text-slate-300">Bronze · Silver · Gold · Platinum · Diamond · Master · Champion</p>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-10">
        <AdPlaceholder locale={locale} />
      </div>
      <section className="mt-14">
        <SectionTitle title={dict.home.popular} />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((test) => <TestCard key={test.slug} test={test} locale={locale} />)}
        </div>
      </section>
      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <div>
          <SectionTitle title={dict.home.categories} />
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(categoryLabels).map(([key, label]) => (
              <div key={key} className="rounded-lg border border-white/10 bg-white/[0.035] p-4 text-white">{label[locale]}</div>
            ))}
          </div>
        </div>
        <div>
          <SectionTitle title={dict.home.howItWorks} />
          <ol className="space-y-3">
            {dict.home.steps.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-slate-200">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-cyan-300 text-sm font-black text-slate-950">{index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="mt-14 rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h2 className="text-2xl font-black tracking-tight text-white">
          {locale === "ko" ? "테스티어는 왜 Test + Tier인가요?" : "Why Testier means Test + Tier"}
        </h2>
        <div className="mt-4 grid gap-5 text-sm leading-7 text-slate-300 md:grid-cols-3">
          <p>
            {locale === "ko"
              ? "테스티어는 짧은 웹 테스트를 통해 반응속도, 조준력, 기억력, 집중력, 타자 속도를 확인하고, 숫자 결과를 게임 티어처럼 이해하기 쉽게 보여주는 사이트입니다."
              : "Testier turns short web tests into easy-to-read tier results, helping you understand reaction speed, aim, memory, focus, and typing performance at a glance."}
          </p>
          <p>
            {locale === "ko"
              ? "모든 테스트는 설치 없이 브라우저에서 실행되며, 최고 기록과 최근 기록은 현재 기기의 브라우저 저장소에만 남습니다. 서버 계정이나 로그인은 필요하지 않습니다."
              : "Every test runs directly in the browser with no installation. Best and recent scores stay in local browser storage, so no account or login is required."}
          </p>
          <p>
            {locale === "ko"
              ? "결과는 공유 링크로 보낼 수 있어 친구와 기록을 비교하기 쉽습니다. 단, 결과는 기기와 브라우저 환경의 영향을 받을 수 있으므로 참고용으로 해석해야 합니다."
              : "Results can be shared by link, making it easy to compare scores with friends. Device and browser conditions can affect results, so scores should be read as references."}
          </p>
        </div>
      </section>
      <p className="mt-10 rounded-lg border border-white/10 bg-white/[0.035] p-4 text-sm leading-6 text-slate-300">{dict.common.disclaimer}</p>
    </Container>
  );
}
