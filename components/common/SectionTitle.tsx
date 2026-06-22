import type { ReactNode } from "react";

export function SectionTitle({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
