import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface Props {
  title: string;
  subtitle?: string;
  readMoreLink?: string;
  /** 编辑推荐区左上角小标签，如 whv / travel */
  editorialKicker?: string;
  /** 首页编辑推荐风：无主色竖条，字重更轻 */
  variant?: 'default' | 'editorial';
}

const SectionHeader = ({
  title,
  subtitle,
  readMoreLink = '/blog',
  editorialKicker = 'feed',
  variant = 'default',
}: Props) => {
  const { t } = useTranslation('home');

  if (variant === 'editorial') {
    return (
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5'>
        <div className='max-w-xl'>
          <p className='inline-flex w-fit rounded-full bg-stone-100 dark:bg-neutral-800/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-600 dark:text-neutral-300 mb-4'>
            {editorialKicker}
          </p>
          <h2 className='text-[1.4rem] md:text-2xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white'>
            {title}
          </h2>
          {subtitle ? (
            <p className='mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed'>
              {subtitle}
            </p>
          ) : null}
        </div>
        {readMoreLink ? (
          <Link
            href={readMoreLink}
            className='shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#62BFAD] transition-colors underline-offset-[6px] hover:underline decoration-[#62BFAD]/40'
          >
            {t('explore.viewAll')} →
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-5 mb-8 md:mb-10'>
      <div className='max-w-xl'>
        <h2 className='text-[1.35rem] md:text-2xl font-semibold tracking-[-0.02em] text-neutral-950 dark:text-white'>
          {title}
        </h2>
        {subtitle ? (
          <p className='mt-2 text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed'>
            {subtitle}
          </p>
        ) : null}
      </div>
      {readMoreLink ? (
        <Link
          href={readMoreLink}
          className='hidden md:inline-flex shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#62BFAD] transition-colors underline-offset-[6px] hover:underline decoration-[#62BFAD]/40'
        >
          {t('explore.readMore')} →
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeader;
