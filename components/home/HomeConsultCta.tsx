import { useTranslation } from 'next-i18next';
import SiteConfig from '@/site.config';
import HomePageSection from '@/components/home/HomePageSection';

const HomeConsultCta = () => {
  const { email } = SiteConfig;
  const { t } = useTranslation('home');

  return (
    <HomePageSection id='consult' aria-label={t('landing.cta.ariaConsult')} tone='accent'>
      <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-[#4a9e8f] dark:text-[#62BFAD] mb-3'>
        {t('landing.cta.sectionEyebrow')}
      </p>
      <h2 className='text-xl md:text-[1.65rem] font-semibold tracking-tight text-neutral-900 dark:text-white leading-snug max-w-xl'>
        {t('landing.cta.title')}
      </h2>
      <div className='mt-6 text-neutral-600 dark:text-neutral-300 text-sm md:text-[15px] leading-relaxed space-y-3 max-w-xl'>
        <p>{t('landing.cta.p1')}</p>
        <p className='text-neutral-500 dark:text-neutral-400'>
          {t('landing.cta.p2')}
        </p>
      </div>

      <div className='mt-8'>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(
            t('landing.cta.mailSubject'),
          )}`}
          className='inline-flex justify-center items-center px-8 py-3 rounded-full bg-[#62BFAD] text-white text-sm font-semibold hover:bg-[#56b09f] hover:brightness-[1.02] transition-colors shadow-[0_6px_24px_-10px_rgba(98,191,173,0.65)]'
        >
          {t('landing.cta.primaryBtn')}
        </a>
      </div>
      <p className='mt-6 text-[12px] text-neutral-500 dark:text-neutral-400 max-w-xl leading-relaxed'>
        {t('landing.cta.whvNote')}
      </p>
      <p className='mt-10 text-[11px] text-neutral-400 dark:text-neutral-500 break-all'>
        {email}
      </p>
    </HomePageSection>
  );
};

export default HomeConsultCta;
