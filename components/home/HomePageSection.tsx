/** 提供首页各区块共用的语义容器、色调与无障碍标签。 */
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
      ? 'bg-ink text-surface'
      : tone === 'accent'
        ? 'bg-primarySoft'
        : 'bg-canvas';

  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`scroll-mt-20 border-b border-line ${surface} ${className}`}
    >
      <div className='site-container site-section'>{children}</div>
    </section>
  );
};

export default HomePageSection;
