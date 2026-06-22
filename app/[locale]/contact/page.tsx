import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "운영자 이메일 입력 필요";

const topics = {
  ko: [
    "일반 문의 및 서비스 이용 도움",
    "버그 신고와 오류 제보",
    "새로운 테스트 또는 기능 제안",
    "광고, 제휴, 비즈니스 문의",
    "개인정보 열람·삭제 등 권리 요청",
  ],
  en: [
    "General questions and usage help",
    "Bug reports and error feedback",
    "New test or feature suggestions",
    "Advertising, partnership, and business inquiries",
    "Privacy requests such as access or deletion",
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: `/${locale}/contact`, title: dict.legal.contactTitle, description: dict.legal.contactIntro });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);

  return (
    <Container className="py-12">
      <article className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h1 className="text-4xl font-black tracking-tight text-white">{dict.legal.contactTitle}</h1>
        <p className="mt-5 text-base leading-8 text-slate-300">{dict.legal.contactIntro}</p>

        <div className="mt-6 rounded-lg border border-cyan-300/20 bg-cyan-300/[0.06] p-5">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200/80">Email</p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-2 inline-block break-all text-lg font-black text-cyan-100 hover:text-white"
          >
            {contactEmail}
          </a>
        </div>

        <h2 className="mt-8 text-xl font-black text-white">
          {locale === "ko" ? "이런 내용을 보내주세요" : "What you can contact us about"}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-slate-300">
          {topics[locale].map((topic) => (
            <li key={topic}>{topic}</li>
          ))}
        </ul>

        <p className="mt-8 text-sm leading-7 text-slate-400">
          {locale === "ko"
            ? "테스티어는 회원가입이나 로그인이 없으므로, 기록 관련 문의 시 사용한 테스트와 브라우저 환경을 함께 알려주시면 더 빠르게 도와드릴 수 있습니다."
            : "Testier has no sign-up or login, so when you contact us about scores, sharing the test you used and your browser environment helps us assist you faster."}
        </p>
      </article>
    </Container>
  );
}
