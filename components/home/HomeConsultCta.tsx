/** 使用 home i18n 和站点邮箱渲染首页咨询服务行动号召区。 */
import { useTranslation } from 'next-i18next';
import SiteConfig from '@/site.config';
import HomePageSection from '@/components/home/HomePageSection';
import { FiGithub, FiArrowUpRight, FiSend } from 'react-icons/fi';
import { GITHUB_PROFILE_URL } from '@/lib/home/openSourceProjects';

const HomeConsultCta = () => {
  const { email } = SiteConfig;
  const { t } = useTranslation('home');

  return (
    <HomePageSection id='consult' aria-label={t('landing.cta.ariaConsult')} className='[&>div]:pt-4'>
      <div className='flex flex-col gap-6 rounded-2xl border border-line bg-primarySoft p-6 sm:p-8 md:flex-row md:items-center md:justify-between'>
      <div>
      <p className='mb-3 text-[11px] font-medium uppercase tracking-[0.22em] text-primaryStrong'>
        {t('landing.cta.sectionEyebrow')}
      </p>
      <h2 className='max-w-xl text-xl font-medium leading-snug tracking-tight text-ink md:text-2xl'>
        {t('landing.cta.title')}
      </h2>
      <div className='mt-3 max-w-xl space-y-1 text-xs leading-6 text-subtle'>
        <p>{t('landing.cta.p1')}</p>
        <p className='text-subtle'>
          {t('landing.cta.p2')}
        </p>
      </div>

      </div>
      <FiSend aria-hidden='true' className='hidden h-12 w-12 shrink-0 text-primaryStrong/40 lg:block' strokeWidth={1} />
      <div className='flex shrink-0 items-center gap-3'>
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(
            t('landing.cta.mailSubject'),
          )}`}
          className='editorial-focus inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-primaryStrong px-6 py-2.5 text-xs font-medium text-surface transition hover:bg-ink focus-visible:outline-ink active:translate-y-px motion-reduce:transform-none'
        >
          {t('landing.cta.primaryBtn')} <FiArrowUpRight aria-hidden='true' />
        </a>
        <a href={GITHUB_PROFILE_URL} aria-label='GitHub — Jessie-jzn' target='_blank' rel='noreferrer' className='editorial-focus inline-flex h-11 w-11 items-center justify-center rounded-full bg-surface text-ink hover:text-primaryStrong'><FiGithub className='h-5 w-5' /></a>
      </div>
      </div>
    </HomePageSection>
  );
};

export default HomeConsultCta;
