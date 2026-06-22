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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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

export const publicSiteUrl = siteUrl;
