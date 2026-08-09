import { useTranslation } from 'next-i18next';
import SiteConfig from '@/site.config';
import HomePageSection from '@/components/home/HomePageSection';

const HomeConsultCta = () => {
  const { email } = SiteConfig;
  const { t } = useTranslation('home');

  return (
    <HomePageSection id='consult' aria-label={t('landing.cta.ariaConsult')} tone='accent'>
      <p className='mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong'>
        {t('landing.cta.sectionEyebrow')}
      </p>
      <h2 className='max-w-xl text-xl font-semibold leading-snug tracking-tight text-ink md:text-[1.65rem]'>
        {t('landing.cta.title')}
      </h2>
      <div className='mt-6 max-w-xl space-y-3 text-sm leading-relaxed text-subtle md:text-[15px]'>
        <p>{t('landing.cta.p1')}</p>
        <p className='text-subtle'>
          {t('landing.cta.p2')}
        </p>
      </div>

      <ul className='mt-6 max-w-2xl divide-y divide-line border-y border-line text-sm text-subtle'>
        {(['ads', 'ai', 'whv'] as const).map((key) => (
          <li
            key={key}
            className='grid gap-1 py-5 sm:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] sm:gap-6'
          >
            <p className='font-medium text-ink'>
              {t(`landing.cta.paths.${key}.title`)}
            </p>
            <p className='leading-relaxed'>
              {t(`landing.cta.paths.${key}.description`)}
            </p>
          </li>
        ))}
      </ul>

      <div className='mt-8'>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(
            t('landing.cta.mailSubject'),
          )}`}
          className='editorial-focus inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-full border border-ink bg-ink px-8 py-2.5 text-sm font-semibold text-surface transition hover:border-primaryStrong hover:bg-primaryStrong active:translate-y-px motion-reduce:transform-none'
        >
          {t('landing.cta.primaryBtn')}
        </a>
      </div>
      <p className='mt-6 max-w-xl text-[12px] leading-relaxed text-subtle'>
        {t('landing.cta.whvNote')}
      </p>
      <p className='mt-10 break-all text-[11px] text-subtle'>
        {email}
      </p>
    </HomePageSection>
  );
};

export default HomeConsultCta;
