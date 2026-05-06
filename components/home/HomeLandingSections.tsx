import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import HomePageSection from '@/components/home/HomePageSection';

type ServiceBlock = {
  heading: string;
  items: string[];
};

const HomeLandingSections = () => {
  const { t } = useTranslation('home');

  const blocksRaw = t('landing.services.blocks', { returnObjects: true }) as unknown;
  const blocks = Array.isArray(blocksRaw)
    ? (blocksRaw as ServiceBlock[])
    : [];

  return (
    <HomePageSection id='services' aria-label={t('landing.aria.services')}>
      <div className='flex flex-wrap items-start justify-between gap-6 mb-8'>
        <div className='max-w-2xl'>
          <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-[#62BFAD] mb-3'>
            {t('landing.services.sectionLabel')}
          </p>
          <h2 className='text-neutral-950 dark:text-white text-xl md:text-[1.35rem] font-semibold tracking-tight leading-snug mb-8'>
            {t('landing.services.title')}
          </h2>

          <div className='space-y-8 text-[15px] md:text-[0.97rem] text-neutral-700 dark:text-neutral-300 leading-relaxed'>
            {blocks.map((block, i) => (
              <div key={i}>
                <p className='font-semibold text-neutral-900 dark:text-white mb-2'>
                  {block.heading}
                </p>
                <ul className='space-y-1.5 pl-0 list-none'>
                  {(block.items || []).map((line, j) => (
                    <li
                      key={j}
                      className='pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-neutral-400/70'
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <Link
          href='/about'
          className='shrink-0 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-[#62BFAD] transition-colors underline-offset-4 hover:underline mt-1'
        >
          {t('landing.services.aboutLink')}
        </Link>
      </div>

      <p className='text-sm text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-white/[0.08] pt-6'>
        {t('landing.services.footer')}
      </p>
    </HomePageSection>
  );
};

export default HomeLandingSections;
