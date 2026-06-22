import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { TestLayout } from "@/components/tests/TestLayout";
import { TestRenderer } from "@/components/tests/TestRenderer";
import { isLocale, type Locale } from "@/lib/locales";
import { breadcrumbJsonLd, faqJsonLd, testMetadata } from "@/lib/seo";
import { getDictionary } from "@/lib/dictionary";
import { getTest, tests } from "@/lib/tests";

export function generateStaticParams() {
  return tests.map((test) => ({ slug: test.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const test = getTest(slug);
  if (!test) return {};
  return testMetadata(rawLocale as Locale, test);
}

export default async function TestPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const test = getTest(slug);
  if (!test) notFound();
  const dict = getDictionary(locale);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Testier", path: `/${locale}` },
    { name: dict.nav.tests, path: `/${locale}/tests` },
    { name: test.title[locale], path: `/${locale}/tests/${test.slug}` },
  ]);
  return (
    <Container className="py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(locale, test)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <TestLayout locale={locale} test={test}>
        <TestRenderer locale={locale} test={test} />
      </TestLayout>
    </Container>
  );
}
