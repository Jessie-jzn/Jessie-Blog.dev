/** 渲染支持 home i18n 与编辑推荐变体的栏目标题和“查看更多”链接。 */
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
          <p className='editorial-tag inline-flex w-fit rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] mb-4'>
            {editorialKicker}
          </p>
          <h2 className='text-[1.4rem] md:text-2xl font-semibold tracking-[-0.02em] text-ink'>
            {title}
          </h2>
          {subtitle ? (
            <p className='mt-2 text-sm text-subtle leading-relaxed'>
              {subtitle}
            </p>
          ) : null}
        </div>
        {readMoreLink ? (
          <Link
            href={readMoreLink}
            className='editorial-focus shrink-0 text-sm font-medium text-subtle hover:text-primaryStrong transition-colors underline-offset-[6px] hover:underline decoration-primary/40'
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
        <h2 className='text-[1.35rem] md:text-2xl font-semibold tracking-[-0.02em] text-ink'>
          {title}
        </h2>
        {subtitle ? (
          <p className='mt-2 text-sm text-subtle leading-relaxed'>
            {subtitle}
          </p>
        ) : null}
      </div>
      {readMoreLink ? (
        <Link
          href={readMoreLink}
          className='editorial-focus hidden md:inline-flex shrink-0 text-sm font-medium text-subtle hover:text-primaryStrong transition-colors underline-offset-[6px] hover:underline decoration-primary/40'
        >
          {t('explore.readMore')} →
        </Link>
      ) : null}
    </div>
  );
};

export default SectionHeader;
