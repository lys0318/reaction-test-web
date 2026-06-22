import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "운영자 이메일 입력 필요";

const privacySections = {
  ko: [
    {
      title: "1. 처리하는 정보",
      body: "테스티어는 현재 회원가입을 제공하지 않으며 이름, 전화번호, 주소와 같은 직접적인 개인 식별 정보를 요구하지 않습니다. 테스트 최고 기록과 최근 기록은 사용자의 브라우저 localStorage에 저장됩니다. 리더보드에 기록을 등록하면 사용자가 직접 입력한 닉네임과 점수가 서버(Cloudflare D1)에 저장됩니다. 닉네임에는 실명 등 개인 식별 정보를 입력하지 않는 것을 권장합니다. 결과 공유 링크를 만들면 점수, 티어, 상위 퍼센트 문구가 URL 쿼리 파라미터에 포함될 수 있습니다.",
    },
    {
      title: "2. 자동으로 처리될 수 있는 정보",
      body: "서비스 안정성, 보안, 통계, 광고 제공을 위해 접속 시간, 브라우저 종류, 기기 정보, 대략적인 지역, IP 주소, 쿠키 또는 유사 기술 정보가 호스팅 제공자, 광고 제공자, 브라우저에 의해 처리될 수 있습니다. 방문 통계 분석을 위해 Google Analytics(GA4)를 사용하며, 이 과정에서 쿠키와 익명화된 사용 데이터가 처리될 수 있습니다.",
    },
    {
      title: "3. localStorage와 쿠키",
      body: "localStorage는 브라우저 안에 기록을 저장하기 위해 사용되며 사용자가 브라우저 데이터를 삭제하거나 사이트 내 기록 지우기 기능을 사용하면 삭제할 수 있습니다. 향후 Google AdSense 또는 Kakao AdFit 광고가 적용되면 광고 쿠키가 사용될 수 있습니다.",
    },
    {
      title: "4. Google AdSense 안내",
      body: "Google을 포함한 제3자 광고 사업자는 사용자의 이전 웹사이트 방문 정보를 기반으로 광고를 게재하기 위해 쿠키를 사용할 수 있습니다. Google의 광고 쿠키 사용으로 Google과 파트너가 이 사이트 또는 다른 사이트 방문 정보를 기반으로 광고를 제공할 수 있습니다.",
    },
    {
      title: "5. Kakao AdFit 안내",
      body: "Kakao AdFit 광고가 적용되는 경우 카카오 및 파트너사는 광고 쿠키, 브라우저 정보, 기기 정보, IP 주소, 온라인 행태정보 등을 이용해 광고 제공, 광고 거래, 맞춤형 광고 및 성과 측정에 활용할 수 있습니다.",
    },
    {
      title: "6. 맞춤형 광고 거부 방법",
      body: "Google 맞춤형 광고는 Google 광고 설정에서 관리할 수 있고, 일부 제3자 광고 쿠키는 aboutads.info에서 선택 해제할 수 있습니다. 카카오 맞춤형 광고는 카카오 맞춤형 광고 안내 페이지와 브라우저 쿠키 설정에서 관리할 수 있습니다.",
    },
    {
      title: "7. 보관 기간",
      body: "브라우저 localStorage 기록은 사용자가 직접 삭제할 때까지 기기에 남을 수 있습니다. 서버 로그와 광고 관련 정보의 보관 기간은 호스팅 제공자 및 광고 제공자의 정책에 따릅니다.",
    },
    {
      title: "8. 제3자 제공 및 국외 처리",
      body: "테스티어는 회원 정보를 판매하지 않습니다. 다만 광고, 호스팅, 보안, 성능 측정 과정에서 Google, Kakao, 호스팅 제공자 등 제3자가 각자의 정책에 따라 정보를 처리할 수 있으며, 일부 처리는 국외에서 이루어질 수 있습니다.",
    },
    {
      title: "9. 아동의 개인정보",
      body: "테스티어는 만 14세 미만 아동을 대상으로 개인정보를 의도적으로 수집하지 않습니다. 보호자가 관련 문의를 하는 경우 확인 후 필요한 조치를 취합니다.",
    },
    {
      title: "10. 이용자의 권리와 문의",
      body: `사용자는 브라우저 데이터 삭제, 쿠키 차단, 맞춤형 광고 거부 설정을 통해 정보 처리 범위를 관리할 수 있습니다. 개인정보 관련 문의는 ${contactEmail} 로 연락해 주세요.`,
    },
    {
      title: "11. 정책 변경",
      body: "광고 서비스, 분석 도구, 회원 기능 등이 추가되면 본 개인정보 처리방침이 변경될 수 있습니다. 중요한 변경 사항은 사이트 내에서 확인할 수 있도록 고지합니다. 시행일: 2026-06-22",
    },
  ],
  en: [
    {
      title: "1. Information We Process",
      body: "Testier currently does not provide accounts and does not ask for direct identifiers such as name, phone number, or address. Best and recent test scores are stored in your browser localStorage. If you submit a score to the leaderboard, the nickname and score you enter are stored on our server (Cloudflare D1); we recommend not using real names or personal identifiers as a nickname. When you create a share link, score, tier, and percentile text may be included in the URL query string.",
    },
    {
      title: "2. Information That May Be Processed Automatically",
      body: "For reliability, security, statistics, and advertising, access time, browser type, device information, approximate location, IP address, cookies, or similar technology data may be processed by hosting providers, ad providers, or the browser. We use Google Analytics (GA4) for visit statistics, which may process cookies and anonymized usage data.",
    },
    {
      title: "3. localStorage and Cookies",
      body: "localStorage is used to save records inside your browser. You can remove it by clearing browser data or using the site's clear-records feature. If Google AdSense or Kakao AdFit ads are added later, advertising cookies may be used.",
    },
    {
      title: "4. Google AdSense Notice",
      body: "Third-party vendors, including Google, may use cookies to serve ads based on a user's prior visits to this website or other websites. Google's advertising cookies allow Google and its partners to serve ads based on visits to this site and other sites.",
    },
    {
      title: "5. Kakao AdFit Notice",
      body: "If Kakao AdFit ads are added, Kakao and its partners may use advertising cookies, browser information, device information, IP address, and online behavior information for ad delivery, ad transactions, personalized ads, and measurement.",
    },
    {
      title: "6. Personalized Ads Opt-Out",
      body: "You can manage Google personalized ads in Google Ads Settings, and some third-party advertising cookies may be managed through aboutads.info. Kakao personalized advertising can be managed through Kakao's personalized ads page and browser cookie settings.",
    },
    {
      title: "7. Retention",
      body: "Browser localStorage records may remain on your device until you delete them. Server logs and advertising-related data are retained according to the policies of the hosting provider and ad providers.",
    },
    {
      title: "8. Third Parties and International Processing",
      body: "Testier does not sell account information. However, Google, Kakao, hosting providers, and other third parties may process information under their own policies for advertising, hosting, security, and performance purposes, and some processing may occur outside your country.",
    },
    {
      title: "9. Children's Privacy",
      body: "Testier does not knowingly collect personal information from children under 14. If a guardian contacts us about such information, we will review and take appropriate action.",
    },
    {
      title: "10. Your Choices and Contact",
      body: `You can manage processing by clearing browser data, blocking cookies, or using personalized ad opt-out settings. For privacy questions, contact: ${contactEmail}.`,
    },
    {
      title: "11. Changes",
      body: "This Privacy Policy may change if advertising services, analytics tools, or account features are added. Material changes will be posted on the site. Effective date: 2026-06-22",
    },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: `/${locale}/privacy`, title: dict.legal.privacyTitle, description: dict.legal.privacyBody });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return (
    <Container className="py-12">
      <article className="mx-auto max-w-4xl rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h1 className="text-4xl font-black tracking-tight text-white">{dict.legal.privacyTitle}</h1>
        <p className="mt-4 text-sm leading-7 text-slate-400">
          {locale === "ko"
            ? "본 문서는 Testier 서비스와 향후 Google AdSense, Kakao AdFit 광고 적용을 고려한 개인정보 처리 안내입니다."
            : "This document explains Testier privacy practices and planned Google AdSense and Kakao AdFit advertising disclosures."}
        </p>
        <div className="mt-8 space-y-6">
          {privacySections[locale].map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-black text-white">{section.title}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
        <div className="mt-8 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-4 text-sm leading-7 text-slate-300">
          <p className="font-bold text-cyan-100">{locale === "ko" ? "광고 설정 참고 링크" : "Ad Preference Links"}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li><a className="text-cyan-200 hover:text-cyan-100" href="https://adssettings.google.com/" target="_blank" rel="noreferrer">Google Ads Settings</a></li>
            <li><a className="text-cyan-200 hover:text-cyan-100" href="https://www.aboutads.info/choices/" target="_blank" rel="noreferrer">aboutads.info choices</a></li>
            <li><a className="text-cyan-200 hover:text-cyan-100" href="https://info.ad.daum.net/optoutko.do" target="_blank" rel="noreferrer">Kakao personalized ads opt-out</a></li>
          </ul>
        </div>
      </article>
    </Container>
  );
}
