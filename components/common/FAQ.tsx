import type { FAQItem } from "@/lib/tests";

export function FAQ({ title, items }: { title: string; items: FAQItem[] }) {
  return (
    <section>
      <h2 className="mb-4 text-2xl font-black tracking-tight text-white">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <details
            key={item.question}
            className="group rounded-lg border border-white/10 bg-white/[0.035] p-4 open:border-cyan-300/30"
          >
            <summary className="cursor-pointer text-sm font-bold text-slate-100 outline-none marker:text-cyan-300 focus-visible:ring-2 focus-visible:ring-cyan-300">
              {item.question}
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-300">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
