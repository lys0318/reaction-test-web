import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/common/Container";
import { getDictionary } from "@/lib/dictionary";
import { isLocale, type Locale } from "@/lib/locales";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) return {};
  const locale = rawLocale as Locale;
  const dict = getDictionary(locale);
  return buildMetadata({ locale, path: `/${locale}/about`, title: dict.legal.aboutTitle, description: dict.legal.aboutBody });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const dict = getDictionary(rawLocale);
  return (
    <Container className="py-12">
      <article className="max-w-3xl rounded-lg border border-white/10 bg-white/[0.035] p-6">
        <h1 className="text-4xl font-black tracking-tight text-white">{dict.legal.aboutTitle}</h1>
        <p className="mt-5 text-base leading-8 text-slate-300">{dict.legal.aboutBody}</p>
        <p className="mt-5 text-sm leading-6 text-slate-400">{dict.common.disclaimer}</p>
      </article>
    </Container>
  );
}
