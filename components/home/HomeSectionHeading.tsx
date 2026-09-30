/** 首页专用的轻量栏目标题，不改变其他页面的标题样式。 */
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

export default function HomeSectionHeading({
  display,
  title,
  description,
  href,
}: {
  display?: string;
  title: string;
  description?: string;
  href?: string;
}) {
  const { t } = useTranslation('home');

  return (
    <div className='mb-7 flex flex-wrap items-end justify-between gap-4'>
      <div className='max-w-2xl'>
        <h2 className='text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink sm:text-[1.9rem]'>
          {display || title}
        </h2>
        {display ? <p className='mt-1.5 text-base font-medium text-ink'>{title}</p> : null}
        {description ? <p className='mt-2 text-sm leading-7 text-subtle'>{description}</p> : null}
      </div>
      {href ? (
        <Link href={href} className='editorial-focus inline-flex min-h-11 items-center gap-2 rounded-md text-xs font-medium text-primaryStrong hover:underline'>
          {t('explore.viewAll')} <span aria-hidden='true'>↗</span>
        </Link>
      ) : null}
    </div>
  );
}
