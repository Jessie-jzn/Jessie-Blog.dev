import { useTranslation } from 'next-i18next';
import SiteConfig from '@/site.config';
import HomePageSection from '@/components/home/HomePageSection';

const consultMailHref = (
  email: string,
  subject: string,
  body?: string,
) => {
  const q = [`subject=${encodeURIComponent(subject)}`];
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${q.join('&')}`;
};

const HomeConsultCta = () => {
  const { email } = SiteConfig;
  const { t } = useTranslation('home');

  const mailDraft = t('landing.cta.mailTemplate');

  return (
    <HomePageSection id='consult' aria-label={t('landing.cta.ariaConsult')} tone='accent'>
      <p className='text-[11px] font-medium uppercase tracking-[0.22em] text-[#4a9e8f] dark:text-[#62BFAD] mb-3'>
        {t('landing.cta.sectionEyebrow')}
      </p>
      <h2 className='text-xl md:text-[1.65rem] font-semibold tracking-tight text-neutral-900 dark:text-white leading-snug max-w-xl'>
        {t('landing.cta.title')}
      </h2>
      <div className='mt-6 text-neutral-600 dark:text-neutral-300 text-sm md:text-[15px] leading-relaxed space-y-3 max-w-xl'>
        <p>
          {t('landing.cta.p1Lead')}
          <strong className='font-medium text-neutral-900 dark:text-white'>
            {t('landing.cta.p1Bold1')}
          </strong>
          {t('landing.cta.p1Mid')}
          <strong className='font-medium text-neutral-900 dark:text-white'>
            {t('landing.cta.p1Bold2')}
          </strong>
          {t('landing.cta.p1Trail')}
        </p>
        <p className='text-neutral-500 dark:text-neutral-400'>
          {t('landing.cta.p2')}
        </p>
      </div>

      <div className='mt-8 rounded-xl bg-white/80 dark:bg-black/25 ring-1 ring-[#62BFAD]/20 dark:ring-white/10 px-4 py-4 max-w-xl text-left backdrop-blur-sm'>
        <p className='text-[11px] uppercase tracking-[0.16em] text-[#62BFAD] dark:text-[#62BFAD]/90 mb-2'>
          {t('landing.cta.templateLabel')}
        </p>
        <pre className='font-sans text-[13px] text-neutral-700 dark:text-neutral-200 whitespace-pre-wrap leading-relaxed'>
          {mailDraft}
        </pre>
      </div>

      <div className='mt-8 flex flex-col xs:flex-row flex-wrap gap-3'>
        <a
          href={consultMailHref(email, t('landing.cta.mailSubject'), mailDraft)}
          className='inline-flex justify-center items-center px-8 py-3 rounded-full bg-[#62BFAD] text-white text-sm font-semibold hover:bg-[#56b09f] hover:brightness-[1.02] transition-colors shadow-[0_6px_24px_-10px_rgba(98,191,173,0.65)]'
        >
          {t('landing.cta.primaryBtn')}
        </a>
        <a
          href={`mailto:${email}`}
          className='inline-flex justify-center items-center px-8 py-3 rounded-full bg-white dark:bg-neutral-800/80 text-neutral-800 dark:text-neutral-100 text-sm font-medium ring-1 ring-neutral-200/90 dark:ring-white/15 hover:bg-stone-50 dark:hover:bg-neutral-800 transition-colors'
        >
          {t('landing.cta.secondaryBtn')}
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
