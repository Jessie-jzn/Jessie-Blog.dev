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
    <HomePageSection id='technology-and-life' aria-label={t('landing.aria.services')}>
      <div className='flex flex-wrap items-start justify-between gap-6 mb-8'>
        <div className='max-w-2xl'>
          <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong mb-3'>
            {t('landing.services.sectionLabel')}
          </p>
          <h2 className='text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.35rem] mb-8'>
            {t('landing.services.title')}
          </h2>

          <div className='space-y-8 text-[15px] md:text-[0.97rem] text-subtle leading-relaxed'>
            {blocks.map((block, i) => (
              <div key={i}>
                <p className='font-semibold text-ink mb-2'>
                  {block.heading}
                </p>
                <ul className='space-y-1.5 pl-0 list-none'>
                  {(block.items || []).map((line, j) => (
                    <li
                      key={j}
                      className='pl-4 relative before:absolute before:left-0 before:top-[0.55em] before:w-1.5 before:h-px before:bg-primary'
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
          className='editorial-focus mt-1 shrink-0 rounded-md text-sm font-medium text-subtle transition-colors underline-offset-4 hover:text-primaryStrong hover:underline'
        >
          {t('landing.services.aboutLink')}
        </Link>
      </div>

      <p className='border-t border-line pt-6 text-sm text-subtle'>
        {t('landing.services.footer')}
      </p>
    </HomePageSection>
  );
};

export default HomeLandingSections;
