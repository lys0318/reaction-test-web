"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/locales";
import { categoryLabels, tests, type Category } from "@/lib/tests";
import { getDictionary } from "@/lib/dictionary";
import { TestCard } from "./TestCard";

const categories: Category[] = ["reaction", "gamer", "memory", "focus", "typing"];

export function TestDirectory({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<Category | "all">("all");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tests.filter((test) => {
      const matchesCategory = category === "all" || test.category === category;
      const text = `${test.title[locale]} ${test.description[locale]} ${test.keywords.join(" ")}`.toLowerCase();
      return matchesCategory && (!normalized || text.includes(normalized));
    });
  }, [category, locale, query]);

  return (
    <div className="space-y-6">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={dict.tests.search}
          className="min-h-12 rounded-lg border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300"
        />
        <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${category === "all" ? "bg-cyan-300 text-slate-950" : "bg-white/[0.05] text-slate-200"}`}
          >
            {dict.tests.allCategories}
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-lg px-4 py-2 text-sm font-bold ${category === item ? "bg-cyan-300 text-slate-950" : "bg-white/[0.05] text-slate-200"}`}
            >
              {categoryLabels[item][locale]}
            </button>
          ))}
        </div>
      </div>
      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((test) => (
            <TestCard key={test.slug} test={test} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-white/10 bg-white/[0.035] p-6 text-slate-300">{dict.tests.noResults}</p>
      )}
    </div>
  );
}
