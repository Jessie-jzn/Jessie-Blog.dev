import type { ReactNode } from 'react';

type Tone = 'light' | 'dark' | 'accent';

/**
 * 首页统一区块壳：浅色「叠纸卡」accent「薄荷收口」深色（备用）。
 */
const HomePageSection = ({
  id,
  children,
  className = '',
  tone = 'light',
  'aria-label': ariaLabel,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
  'aria-label'?: string;
}) => {
  const surface =
    tone === 'dark'
      ? 'bg-gradient-to-br from-neutral-900 to-neutral-950 dark:from-black dark:to-neutral-950 ring-white/[0.12]'
      : tone === 'accent'
        ? 'bg-gradient-to-br from-[#e9f4f1] via-white to-[#f7f5f2] ring-[#62BFAD]/30 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-900 dark:ring-[#62BFAD]/35'
        : 'bg-white dark:bg-neutral-900 ring-black/[0.05] dark:ring-white/[0.08]';

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`scroll-mt-[5.5rem] rounded-[1.65rem] md:rounded-[2.25rem] shadow-[0_4px_48px_-14px_rgba(0,0,0,0.14)] dark:shadow-[0_4px_40px_-8px_rgba(0,0,0,0.5)] ring-1 overflow-hidden ${surface} ${className}`}
    >
      <div className='px-6 py-10 md:px-11 md:py-12'>{children}</div>
    </section>
  );
};

export default HomePageSection;
