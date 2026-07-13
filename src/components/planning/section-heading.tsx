import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col justify-between gap-5 border-b border-[#d8cdbd] pb-7 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="font-architectural mb-2 text-[10px] tracking-[0.2em] text-[#806839]">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl leading-none text-[#263d32] sm:text-5xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[#65665f] sm:text-[15px]">
          {description}
        </p>
      </div>
      {action}
    </header>
  );
}
