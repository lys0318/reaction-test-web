import { Suspense, type ReactNode } from "react";
import type { Locale } from "@/lib/locales";
import type { TestDefinition } from "@/lib/tests";
import { categoryLabels } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { FAQ } from "@/components/common/FAQ";
import { Leaderboard } from "@/components/tests/Leaderboard";
import { SectionTitle } from "@/components/common/SectionTitle";
import { SharedResultNotice } from "@/components/common/SharedResultNotice";
import { TestBenchmarkGuide } from "@/components/tests/TestBenchmarkGuide";

export function TestLayout({
  locale,
  test,
  children,
}: {
  locale: Locale;
  test: TestDefinition;
  children: ReactNode;
}) {
  const dict = getDictionary(locale);
  return (
    <div className="space-y-8">
      <section>
        <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-5xl">{test.title[locale]}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{test.description[locale]}</p>
      </section>
      <AdPlaceholder locale={locale} />
      <Suspense fallback={null}>
        <SharedResultNotice locale={locale} />
      </Suspense>
      {children}
      <Leaderboard slug={test.slug} scoreType={test.scoreType} locale={locale} />
      <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <SectionTitle title={locale === "ko" ? "테스트 설명" : "About this test"} description={test.seoDescription[locale]} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="text-xl font-black text-white">{dict.common.tips}</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {test.tips[locale].map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05] p-4 text-sm leading-6 text-slate-300">
            {dict.common.disclaimer}
          </div>
        </div>
      </section>
      <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
        <h2 className="text-2xl font-black tracking-tight text-white">
          {locale === "ko" ? `${test.title.ko} 결과를 해석하는 방법` : `How to interpret ${test.title.en} results`}
        </h2>
        <div className="mt-4 grid gap-5 text-sm leading-7 text-slate-300 lg:grid-cols-3">
          <article>
            <h3 className="font-black text-white">{locale === "ko" ? "무엇을 측정하나요?" : "What does it measure?"}</h3>
            <p className="mt-2">
              {locale === "ko"
                ? `${test.title.ko}는 ${categoryLabels[test.category].ko} 카테고리에 속한 테스트입니다. 결과는 한 번의 절대 평가가 아니라 입력 지연, 집중 상태, 기기 환경, 손의 위치 같은 요소가 함께 반영된 참고용 기록입니다.`
                : `${test.title.en} belongs to the ${categoryLabels[test.category].en} category. The result is a reference score influenced by input latency, focus, device setup, and hand position rather than an absolute measurement.`}
            </p>
          </article>
          <article>
            <h3 className="font-black text-white">{locale === "ko" ? "티어는 어떻게 보나요?" : "How tiers work"}</h3>
            <p className="mt-2">
              {locale === "ko"
                ? "테스티어는 결과를 브론즈, 실버, 골드, 플래티넘, 다이아, 마스터, 챔피언 티어로 나눕니다. 티어와 상위 퍼센트 문구는 기록을 직관적으로 비교하기 위한 게임식 표현입니다."
                : "Testier groups results into Bronze, Silver, Gold, Platinum, Diamond, Master, and Champion tiers. Percentile text is a game-style interpretation that makes scores easier to compare."}
            </p>
          </article>
          <article>
            <h3 className="font-black text-white">{locale === "ko" ? "공정하게 측정하려면" : "For a fair run"}</h3>
            <p className="mt-2">
              {locale === "ko"
                ? "같은 기기와 브라우저에서 반복 측정하고, 배터리 절약 모드나 백그라운드 작업을 줄이면 더 안정적인 기록을 얻을 수 있습니다. 기록은 브라우저에 저장되며, 리더보드에 등록할 때만 닉네임과 점수가 서버에 저장됩니다."
                : "Use the same device and browser, reduce background work, and avoid battery-saving modes for more consistent runs. Scores are stored in your browser; only leaderboard submissions save a nickname and score on our server."}
            </p>
          </article>
        </div>
      </section>
      <TestBenchmarkGuide locale={locale} test={test} />
      <FAQ title={dict.common.faq} items={test.faq[locale]} />
    </div>
  );
}
