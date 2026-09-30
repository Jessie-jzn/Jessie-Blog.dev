/** 浅色双栏首页首屏，保留真实介绍、邮件和 GitHub 入口。 */
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { FiGithub, FiArrowUpRight } from 'react-icons/fi';
import { GITHUB_PROFILE_URL } from '@/lib/home/openSourceProjects';

interface HomeHeroProps {
  email: string;
}

const HomeHero: React.FC<HomeHeroProps> = ({ email }) => {
  const { t } = useTranslation('home');
  const shouldReduceMotion = useReducedMotion();
  const mailHint = t('landing.hero.mailHint');

  const headlineRaw = t('landing.hero.headline', {
    returnObjects: true,
  }) as unknown;
  const paragraphsRaw = t('landing.hero.paragraphs', {
    returnObjects: true,
  }) as unknown;

  const headline = Array.isArray(headlineRaw)
    ? headlineRaw.map(String).filter(Boolean)
    : [];

  const paragraphs = Array.isArray(paragraphsRaw)
    ? paragraphsRaw.map(String)
    : [];

  return (
    <section className='relative overflow-hidden bg-canvas'>
      <div className='site-container grid items-center gap-8 pb-10 pt-12 md:min-h-[34rem] md:grid-cols-2 md:gap-10 md:py-16'>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className='relative z-10 max-w-xl motion-reduce:transition-none'
        >
          <p className='mb-6 text-[11px] font-medium tracking-[0.08em] text-subtle'>
            {t('landing.hero.badge')}
          </p>

          <h1 className='text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.055em] text-ink sm:text-[3.5rem] lg:text-[4.25rem]'>
            <span className='block'>CODE.</span>
            <span className='block'>TRAVEL. LIVE.</span>
          </h1>
          <p className='mt-6 text-xl font-medium tracking-tight text-ink'>
            {headline.map((line, i) => (
              <span key={`headline-${i}`}>
                {line}
                {i < headline.length - 1 ? <br /> : null}
              </span>
            ))}
          </p>

          <div className='mt-3 max-w-md space-y-2 text-sm leading-7 text-subtle'>
            {paragraphs.map((block, idx) => (
              <p
                key={`paragraph-${idx}`}
                className='whitespace-pre-line'
              >
                {block}
              </p>
            ))}
          </div>

          <div className='mt-7 flex flex-wrap items-center gap-3'>
            <Link href='/post' className='editorial-focus inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-medium text-[#171717] transition-colors hover:bg-primarySoft hover:text-primaryStrong'>
              {t('landing.hero.secondaryCta')} <FiArrowUpRight aria-hidden='true' />
            </Link>
            <a href={GITHUB_PROFILE_URL} target='_blank' rel='noreferrer' className='editorial-focus inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-5 text-sm font-medium text-ink transition-colors hover:border-primary hover:bg-primarySoft'>
              <FiGithub aria-hidden='true' /> GitHub <FiArrowUpRight aria-hidden='true' />
            </a>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                t('landing.hero.primaryMailSubject'),
              )}`}
              className='editorial-focus inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-xs font-medium text-primaryStrong hover:underline motion-reduce:transition-none'
            >
              {t('landing.hero.primaryCta')} <FiArrowUpRight aria-hidden='true' />
            </a>
          </div>
          {mailHint?.trim() ? (
            <p className='mt-4 max-w-md text-[11px] leading-relaxed text-subtle'>
              {mailHint}
            </p>
          ) : null}
        </motion.div>

        <div className='relative aspect-[4/3] overflow-hidden rounded-xl bg-muted md:aspect-auto md:h-[26rem]'>
          <Image src='/images/home/editorial-desk.webp' alt='' fill priority sizes='(max-width: 767px) 100vw, (max-width: 1152px) 50vw, 544px' className='object-cover dark:brightness-75' />
        </div>
      </div>
      <div className='site-container'>
        <div className='flex flex-wrap justify-between gap-2 border-t border-line py-4 text-[11px] text-subtle'>
          <span>{t('landing.hero.footerLeft')}</span>
          <span>{t('landing.hero.footerRight')}</span>
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
