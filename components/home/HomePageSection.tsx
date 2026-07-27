import type { ReactNode } from 'react';

type Tone = 'light' | 'dark' | 'accent';

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
      ? 'border-y border-line bg-ink text-surface'
      : tone === 'accent'
        ? 'border-y border-line bg-primarySoft'
        : 'bg-canvas';

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`scroll-mt-20 ${surface} ${className}`}
    >
      <div className='site-container site-section'>{children}</div>
    </section>
  );
};

export default HomePageSection;
