import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "운영자 이메일 입력 필요";

const termsSections = {
  ko: [
    {
      title: "1. 목적",
      body: "본 약관은 Testier(테스티어)가 제공하는 반응속도, 에임, 기억력, 집중력, 타자 테스트 및 관련 콘텐츠 이용 조건을 설명합니다.",
    },
    {
      title: "2. 서비스의 성격",
      body: "테스티어는 오락, 자기 점검, 연습 참고를 위한 웹 테스트 서비스입니다. 테스트 결과와 티어는 재미와 비교를 위한 참고 지표이며 의학적, 심리학적, 과학적, 교육적, 직업적 평가나 진단으로 사용할 수 없습니다.",
    },
    {
      title: "3. 결과의 정확도와 한계",
      body: "반응속도와 점수는 기기 성능, 모니터 주사율, 브라우저 상태, 입력장치, 네트워크, 피로도, 주변 환경에 영향을 받을 수 있습니다. 동일 사용자의 결과도 환경에 따라 달라질 수 있습니다.",
    },
    {
      title: "4. 기록 저장과 공유",
      body: "테스트 기록은 기본적으로 사용자의 브라우저 localStorage에 저장됩니다. 리더보드에 직접 등록하면 입력한 닉네임과 점수가 서버에 저장되어 다른 이용자에게 공개될 수 있습니다. 결과 공유 링크에는 점수, 티어, 상위 퍼센트 문구가 URL에 포함될 수 있으므로 공개 게시 전 공유 내용을 확인해야 합니다.",
    },
    {
      title: "5. 이용자의 책임",
      body: "사용자는 자신의 판단과 책임으로 서비스를 이용합니다. 테스트 결과를 과장하거나 공식 인증처럼 표시하는 행위, 타인을 기만하는 행위, 결과를 부적절한 목적으로 사용하는 행위는 권장하지 않습니다.",
    },
    {
      title: "6. 금지 행위",
      body: "자동화된 클릭, 매크로, 봇, 비정상적인 반복 요청, 서비스 방해, 취약점 악용, 무단 수집, 광고 부정 클릭, 법령이나 제3자 권리를 침해하는 행위를 금지합니다.",
    },
    {
      title: "7. 광고와 외부 링크",
      body: "테스티어에는 Google AdSense, Kakao AdFit 등 제3자 광고가 표시될 수 있습니다. 광고와 외부 링크의 상품, 서비스, 개인정보 처리, 결제, 분쟁은 해당 제공자의 정책과 책임에 따릅니다.",
    },
    {
      title: "8. 지식재산권",
      body: "테스티어의 이름, 화면 구성, 문서, 테스트 설명, 코드와 디자인 요소에 관한 권리는 운영자 또는 정당한 권리자에게 있습니다. 개인적인 이용 범위를 넘어 무단 복제, 배포, 상업적 재사용을 할 수 없습니다.",
    },
    {
      title: "9. 서비스 변경과 중단",
      body: "운영자는 기능 개선, 보안, 정책 변경, 비용, 기술적 문제 등의 사유로 서비스의 일부 또는 전부를 변경, 제한, 중단할 수 있습니다.",
    },
    {
      title: "10. 면책",
      body: "운영자는 법령상 허용되는 범위에서 서비스 이용 또는 이용 불가, 결과 해석, 외부 링크 이용, 사용자 기기 또는 브라우저 환경에서 발생하는 손해에 대해 책임을 제한합니다.",
    },
    {
      title: "11. 준거법과 문의",
      body: `본 약관은 대한민국 법령을 기준으로 해석됩니다. 서비스 또는 약관 관련 문의는 ${contactEmail} 로 연락해 주세요. 시행일: 2026-06-22`,
    },
  ],
  en: [
    {
      title: "1. Purpose",
      body: "These Terms explain the conditions for using Testier's reaction, aim, memory, focus, typing tests, and related content.",
    },
    {
      title: "2. Nature of the Service",
      body: "Testier is a web testing service for entertainment, self-checking, and practice reference. Results and tiers are friendly comparison indicators and must not be used as medical, psychological, scientific, educational, or professional evaluations or diagnoses.",
    },
    {
      title: "3. Accuracy and Limitations",
      body: "Reaction time and scores can be affected by device performance, monitor refresh rate, browser state, input device, network, fatigue, and environment. The same user may get different results under different conditions.",
    },
    {
      title: "4. Records and Sharing",
      body: "Test records are stored by default in your browser localStorage. If you submit to the leaderboard, the nickname and score you enter are stored on our server and may be shown publicly to other users. Result share links may include score, tier, and percentile text in the URL, so review the shared content before posting it publicly.",
    },
    {
      title: "5. User Responsibility",
      body: "You use the service at your own discretion and responsibility. Do not present results as official certification, mislead others, or use results for inappropriate purposes.",
    },
    {
      title: "6. Prohibited Conduct",
      body: "Automated clicking, macros, bots, abnormal repeated requests, service disruption, vulnerability exploitation, unauthorized scraping, ad fraud, or conduct violating laws or third-party rights is prohibited.",
    },
    {
      title: "7. Ads and External Links",
      body: "Testier may display third-party ads such as Google AdSense and Kakao AdFit. Products, services, privacy practices, payments, and disputes related to ads or external links are governed by the relevant provider's policies and responsibility.",
    },
    {
      title: "8. Intellectual Property",
      body: "Rights to the Testier name, interface, documents, test descriptions, code, and design elements belong to the operator or legitimate rights holders. Unauthorized copying, distribution, or commercial reuse beyond personal use is not permitted.",
    },
    {
      title: "9. Service Changes and Suspension",
      body: "The operator may change, limit, or suspend part or all of the service for improvements, security, policy changes, cost, or technical reasons.",
    },
    {
      title: "10. Disclaimer",
      body: "To the extent permitted by law, the operator limits liability for damages arising from use or inability to use the service, interpretation of results, external links, or user device and browser environments.",
    },
    {
      title: "11. Governing Law and Contact",
      body: `These Terms are interpreted under the laws of the Republic of Korea. For service or terms questions, contact: ${contactEmail}. Effective date: 2026-06-22`,
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: `/${locale}/terms`, title: dict.legal.termsTitle, description: dict.legal.termsBody });
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return (
    <Container className="py-12">
      <article className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h1 className="text-4xl font-black tracking-tight text-white">{dict.legal.termsTitle}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          {locale === "ko"
            ? "본 약관은 Testier의 무료 웹 테스트와 정보 콘텐츠 이용에 적용됩니다."
            : "These Terms apply to Testier's free web tests and informational content."}
        </p>
        <div className="mt-8 space-y-6">
          {termsSections[locale].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
      </article>
    </Container>
  );
}
