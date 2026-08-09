import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'next-i18next';
import { HOME_WORLD_KEYS } from '@/components/home/HomeContentWorlds';

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
    <section className='relative isolate min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-white/15'>
      <Image
        src='https://img.jessieontheroad.com/image4.jpg'
        alt=''
        fill
        className='-z-20 scale-[1.02] object-cover object-center'
        priority
        sizes='100vw'
      />
      <div className='absolute inset-0 -z-10 bg-gradient-to-r from-neutral-950/90 via-neutral-950/60 to-neutral-950/25' />
      <div className='absolute inset-0 -z-10 bg-gradient-to-t from-neutral-950/70 via-transparent to-neutral-950/15' />

      <div className='site-container relative z-10 grid min-h-[calc(100dvh-4rem)] items-end gap-10 pb-12 pt-20 lg:grid-cols-[minmax(0,1.4fr)_minmax(16rem,0.6fr)] lg:gap-16'>
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className='max-w-2xl motion-reduce:transition-none'
        >
          <p className='mb-5 text-[11px] font-medium tracking-[0.12em] text-white/75'>
            {t('landing.hero.badge')}
          </p>

          <h1 className='text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.04em] text-white [text-shadow:0_4px_40px_rgba(0,0,0,0.45)] xs:text-[2.5rem] sm:text-5xl lg:text-[3.4rem]'>
            {headline.map((line, i) => (
              <span key={`headline-${i}`}>
                {line}
                {i < headline.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>

          <div className='mt-6 max-w-xl space-y-4 text-sm leading-[1.7] text-white/85 sm:text-[15px]'>
            {paragraphs.map((block, idx) => (
              <p
                key={`paragraph-${idx}`}
                className='whitespace-pre-line [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]'
              >
                {block}
              </p>
            ))}
          </div>

          <div className='mt-8 flex flex-wrap gap-3'>
            <a
              href={`mailto:${email}?subject=${encodeURIComponent(
                t('landing.hero.primaryMailSubject'),
              )}`}
              className='editorial-focus inline-flex min-h-[2.85rem] items-center justify-center whitespace-nowrap rounded-full border border-white/30 bg-surface px-7 text-sm font-semibold text-ink transition-colors hover:bg-primarySoft motion-reduce:transition-none'
            >
              {t('landing.hero.primaryCta')}
            </a>
            <Link
              href='/post'
              className='editorial-focus inline-flex min-h-[2.85rem] items-center justify-center whitespace-nowrap rounded-full border border-white/35 bg-neutral-950/20 px-7 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10 motion-reduce:transition-none'
            >
              {t('landing.hero.secondaryCta')}
            </Link>
          </div>
          {mailHint?.trim() ? (
            <p className='mt-4 text-[11px] text-white/50 leading-relaxed max-w-md'>
              {mailHint}
            </p>
          ) : null}
        </motion.div>

        <nav
          aria-label={t('landing.worlds.aria')}
          className='divide-y divide-white/15 border-y border-white/20'
        >
          {HOME_WORLD_KEYS.map((key, index) => (
            <Link
              key={key}
              href={t(`landing.worlds.items.${key}.href`)}
              className='editorial-focus group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-4 text-white transition-colors hover:bg-white/[0.07] motion-reduce:transition-none sm:grid-cols-[3rem_minmax(0,1fr)_auto] lg:px-2'
            >
              <span className='text-xs tabular-nums text-white/50'>
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className='text-sm font-medium sm:text-base'>
                {t(`landing.worlds.items.${key}.title`)}
              </span>
              <span
                aria-hidden='true'
                className='text-lg text-white/55 transition-transform group-hover:translate-x-1 motion-reduce:transition-none'
              >
                →
              </span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default HomeHero;
