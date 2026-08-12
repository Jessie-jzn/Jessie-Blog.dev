/** 从 home i18n 读取服务区块数据并渲染首页落地页服务介绍。 */
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
      <div className='mb-8 flex flex-wrap items-start justify-between gap-6'>
        <div className='max-w-2xl'>
          <p className='mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong'>
            {t('landing.services.sectionLabel')}
          </p>
          <h2 className='text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.35rem]'>
            {t('landing.services.title')}
          </h2>
        </div>
        <Link
          href='/about'
          className='editorial-focus mt-1 inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-md text-sm font-medium text-subtle underline-offset-4 transition hover:text-primaryStrong hover:underline focus-visible:outline-ink active:translate-y-px motion-reduce:transform-none'
        >
          {t('landing.services.aboutLink')}
        </Link>
      </div>

      <div className='divide-y divide-line border-y border-line text-[15px] leading-relaxed text-subtle md:text-[0.97rem]'>
        {blocks.map((block, i) => (
          <div
            key={`${block.heading}-${i}`}
            className='grid gap-3 py-6 sm:grid-cols-[minmax(0,0.35fr)_minmax(0,0.65fr)] sm:gap-8'
          >
            <p className='font-semibold text-ink'>{block.heading}</p>
            <ul className='list-none space-y-1.5 pl-0'>
              {(block.items || []).map((line, j) => (
                <li
                  key={j}
                  className='relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-px before:w-1.5 before:bg-primary'
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className='mt-6 text-sm text-subtle'>
        {t('landing.services.footer')}
      </p>
    </HomePageSection>
  );
};

export default HomeLandingSections;
