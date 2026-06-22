import type { Metadata } from "next";
import type { Locale } from "./locales";
import { defaultLocale } from "./locales";
import type { TestDefinition } from "./tests";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://testier.vercel.app";

type SeoInput = {
  locale: Locale;
  path: string;
  title: string;
  description: string;
};

export function buildMetadata({ locale, path, title, description }: SeoInput): Metadata {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = `${siteUrl}${normalizedPath}`;
  const ogImage = `${siteUrl}/api/og/default`;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: normalizedPath,
      languages: {
        ko: normalizedPath.replace(`/${locale}`, "/ko"),
        en: normalizedPath.replace(`/${locale}`, "/en"),
        "x-default": normalizedPath.replace(`/${locale}`, `/${defaultLocale}`),
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Testier",
      locale: locale === "ko" ? "ko_KR" : "en_US",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Testier" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function testMetadata(locale: Locale, test: TestDefinition): Metadata {
  return buildMetadata({
    locale,
    path: `/${locale}/tests/${test.slug}`,
    title: test.seoTitle[locale],
    description: test.seoDescription[locale],
  });
}

export function faqJsonLd(locale: Locale, test: TestDefinition) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: test.faq[locale].map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Testier",
    alternateName: "테스티어",
    url: `${siteUrl}/${locale}`,
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    description:
      locale === "ko"
        ? "반응속도, 에임, 기억력, 집중력, 타자 속도를 측정하고 결과를 티어로 확인하는 무료 웹 테스트 사이트입니다."
        : "A free web test site for measuring reaction speed, aim, memory, focus, and typing speed, then viewing your tier.",
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export const publicSiteUrl = siteUrl;
