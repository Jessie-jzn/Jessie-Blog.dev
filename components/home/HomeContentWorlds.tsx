/** 依据 home i18n 定义并展示首页内容世界的导航入口。 */
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HomePageSection from '@/components/home/HomePageSection';
import HomeSectionHeading from '@/components/home/HomeSectionHeading';
import { FiMonitor, FiBriefcase, FiMapPin, FiCode } from 'react-icons/fi';

export const HOME_WORLD_KEYS = ['ai', 'whv', 'travel', 'projects'] as const;

export default function HomeContentWorlds() {
  const { t } = useTranslation('home');
  const icons = { ai: FiMonitor, whv: FiBriefcase, travel: FiMapPin, projects: FiCode };

  return (
    <HomePageSection aria-label={t('landing.worlds.aria')} tone='muted'>
      <HomeSectionHeading title={t('landing.worlds.title')} href='/post' />
      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        {HOME_WORLD_KEYS.map((key, index) => {
          const Icon = icons[key];
          return (
          <Link
            key={key}
            href={t(`landing.worlds.items.${key}.href`)}
            className='editorial-focus group flex flex-col rounded-xl border border-line bg-surface p-5 transition-colors hover:border-primary motion-reduce:transition-none'
          >
            <span className='mb-4 flex justify-between text-xs tabular-nums text-subtle'>
              {String(index + 1).padStart(2, '0')}
              <Icon aria-hidden='true' className='h-5 w-5 text-ink' />
            </span>
            <span className='text-sm font-semibold tracking-tight text-ink'>{t(`landing.worlds.items.${key}.eyebrow`)}</span>
            <span className='mt-1 text-sm font-medium text-ink'>
              {t(`landing.worlds.items.${key}.title`)}
            </span>
            <span className='mt-2 text-xs leading-6 text-subtle'>
              {t(`landing.worlds.items.${key}.description`)}
            </span>
            <span
              aria-hidden='true'
              className='mt-auto self-end pt-3 text-lg text-primaryStrong transition-transform group-hover:translate-x-1 motion-reduce:transition-none'
            >
              →
            </span>
          </Link>
        );})}
      </div>
    </HomePageSection>
  );
}
