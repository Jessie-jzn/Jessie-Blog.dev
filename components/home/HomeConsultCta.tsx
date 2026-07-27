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

      <div className='mt-8'>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(
            t('landing.cta.mailSubject'),
          )}`}
          className='editorial-focus inline-flex items-center justify-center rounded-full border border-line bg-primary px-8 py-3 text-sm font-semibold text-ink transition-colors hover:bg-primaryStrong hover:text-surface'
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
