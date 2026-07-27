import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  align?: "left" | "center";
}

const PageHeader = ({
  eyebrow,
  title,
  description,
  meta,
  align = "left",
}: PageHeaderProps) => {
  const alignment = align === "center" ? "items-center text-center" : "items-start";

  return (
    <header className={`site-container site-section flex flex-col gap-4 ${alignment}`}>
      {eyebrow ? (
        <div className="editorial-tag rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]">
          {eyebrow}
        </div>
      ) : null}
      <div className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-base leading-7 text-subtle sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
      {meta ? <div className="text-sm text-subtle">{meta}</div> : null}
    </header>
  );
};

export default PageHeader;
