import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { AdPlaceholder } from "@/components/common/AdPlaceholder";
import { getDictionary } from "@/lib/dictionary";
import { getGuide, guides } from "@/lib/guides";
import { isLocale, type Locale } from "@/lib/locales";
import { breadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) return {};
  const guide = getGuide(slug);
  if (!guide) return {};
  const locale = rawLocale as Locale;
  return buildMetadata({
    locale,
    path: `/${locale}/guides/${slug}`,
    title: guide.title[locale],
    description: guide.description[locale],
  });
}

export default async function GuidePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const guide = getGuide(slug);
  if (!guide) notFound();
  const dict = getDictionary(locale);
  const breadcrumb = breadcrumbJsonLd([
    { name: "Testier", path: `/${locale}` },
    { name: dict.nav.guides, path: `/${locale}/guides` },
    { name: guide.title[locale], path: `/${locale}/guides/${guide.slug}` },
  ]);

  return (
    <Container className="py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <article className="mx-auto max-w-3xl">
        <Link href={`/${locale}/guides`} className="text-sm font-bold text-cyan-200 hover:text-cyan-100">
          {locale === "ko" ? "← 가이드 목록" : "← All guides"}
        </Link>
        <h1 className="mt-5 text-4xl font-black tracking-tight text-white">{guide.title[locale]}</h1>
        <p className="mt-4 text-base leading-8 text-slate-300">{guide.description[locale]}</p>
        <div className="my-8">
          <AdPlaceholder locale={locale} />
        </div>
        <div className="space-y-8">
          {guide.sections[locale].map((section) => (
            <section key={section.heading} className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
              <h2 className="text-2xl font-black text-white">{section.heading}</h2>
              <p className="mt-3 text-base leading-8 text-slate-300">{section.body}</p>
            </section>
          ))}
        </div>
        <p className="mt-8 rounded-lg border border-white/10 bg-slate-950/65 p-4 text-sm leading-7 text-slate-400">{dict.common.disclaimer}</p>
      </article>
    </Container>
  );
}
