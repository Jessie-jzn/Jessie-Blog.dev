/** 依据 home i18n 定义并展示首页内容世界的导航入口。 */
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HomePageSection from '@/components/home/HomePageSection';

export const HOME_WORLD_KEYS = ['ai', 'whv', 'travel', 'life'] as const;

export default function HomeContentWorlds() {
  const { t } = useTranslation('home');

  return (
    <HomePageSection aria-label={t('landing.worlds.aria')}>
      <div className='max-w-2xl'>
        <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong'>
          {t('landing.worlds.eyebrow')}
        </p>
        <h2 className='mt-3 text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl'>
          {t('landing.worlds.title')}
        </h2>
        <p className='mt-3 max-w-xl text-sm leading-relaxed text-subtle sm:text-[15px]'>
          {t('landing.worlds.description')}
        </p>
      </div>

      <div className='mt-10 divide-y divide-line border-y border-line'>
        {HOME_WORLD_KEYS.map((key, index) => (
          <Link
            key={key}
            href={t(`landing.worlds.items.${key}.href`)}
            className='editorial-focus group grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 gap-y-2 py-6 transition-colors hover:bg-muted motion-reduce:transition-none sm:grid-cols-[4rem_minmax(0,0.8fr)_minmax(0,1.2fr)_auto] sm:items-center sm:gap-6 sm:px-3'
          >
            <span className='row-span-2 text-xs tabular-nums text-subtle sm:row-span-1'>
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className='text-base font-semibold text-ink sm:text-lg'>
              {t(`landing.worlds.items.${key}.title`)}
            </span>
            <span className='col-start-2 text-sm leading-relaxed text-subtle sm:col-start-auto'>
              {t(`landing.worlds.items.${key}.description`)}
            </span>
            <span
              aria-hidden='true'
              className='col-start-2 text-lg text-primaryStrong transition-transform group-hover:translate-x-1 motion-reduce:transition-none sm:col-start-auto'
            >
              →
            </span>
          </Link>
        ))}
      </div>

      <Link
        href='/post'
        className='editorial-focus mt-6 inline-flex text-sm font-medium text-primaryStrong hover:underline'
      >
        {t('landing.worlds.allArticles')}
      </Link>
    </HomePageSection>
  );
}
