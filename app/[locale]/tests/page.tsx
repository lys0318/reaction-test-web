import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { Container } from "@/components/common/Container";
import { TestDirectory } from "@/components/tests/TestDirectory";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: `/${locale}/tests`,
    title: locale === "ko" ? "전체 테스트" : "All Tests",
    description: dict.tests.description,
  });
}

export default async function TestsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return (
    <Container className="py-10">
      <section className="mb-8">
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">{dict.tests.title}</h1>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300">{dict.tests.description}</p>
      </section>
      <AdPlaceholder locale={locale} />
      <div className="mt-8">
        <TestDirectory locale={locale} />
      </div>
      <section className="mt-12 rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h2 className="text-2xl font-black tracking-tight text-white">
          {locale === "ko" ? "테스트를 더 정확하게 이용하는 방법" : "How to get more consistent results"}
        </h2>
        <div className="mt-4 grid gap-5 text-sm leading-7 text-slate-300 md:grid-cols-3">
          <p>
            {locale === "ko"
              ? "반응속도와 클릭 속도는 모니터 주사율, 터치 지연, 마우스 상태, 브라우저 부하의 영향을 받을 수 있습니다. 같은 기기에서 여러 번 반복해 평균적인 흐름을 보는 것이 좋습니다."
              : "Reaction and click-speed results can be affected by refresh rate, touch latency, mouse hardware, and browser load. Repeat tests on the same device to understand your trend."}
          </p>
          <p>
            {locale === "ko"
              ? "기억력과 집중력 테스트는 짧은 순간의 상태를 보여줍니다. 피로하거나 주변이 산만할 때보다 조용하고 안정적인 환경에서 더 일관된 결과를 얻을 수 있습니다."
              : "Memory and focus tests reflect your current state. A quiet environment and a rested mind usually produce more consistent results than a distracted session."}
          </p>
          <p>
            {locale === "ko"
              ? "테스티어의 티어는 재미있는 비교를 위한 표현입니다. 의학적 진단이나 전문 평가가 아니며, 자기 개선을 위한 참고 지표로 활용하세요."
              : "Testier tiers are designed for fun comparison and self-improvement. They are not medical diagnoses or professional assessments."}
          </p>
        </div>
      </section>
    </Container>
  );
}
