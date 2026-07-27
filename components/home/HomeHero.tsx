import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

interface HomeHeroProps {
  email: string;
}

const HomeHero: React.FC<HomeHeroProps> = ({ email }) => {
  const { t } = useTranslation('home');
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
    <section className='relative min-h-[min(88vh,820px)] flex flex-col justify-end overflow-hidden'>
      <Image
        src='https://img.jessieontheroad.com/image4.jpg'
        alt=''
        fill
        className='object-cover object-center scale-[1.02]'
        priority
        sizes='100vw'
      />
      <div className='absolute inset-0 bg-neutral-950/35' />
      <div className='absolute inset-0 bg-gradient-to-t from-neutral-950/95 via-neutral-950/40 to-transparent' />

      <div className='site-container relative z-10 pb-14 pt-32 md:pb-16 md:pt-36'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className='max-w-2xl'
        >
          <p className='inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/[0.14] px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-md mb-5'>
            {t('landing.hero.badge')}
          </p>

          <h1 className='text-[2rem] xs:text-[2.35rem] sm:text-4xl md:text-[2.65rem] font-semibold tracking-[-0.03em] text-white leading-snug sm:leading-tight [text-shadow:0_4px_40px_rgba(0,0,0,0.45)]'>
            {headline.map((line, i) => (
              <span key={i}>
                {line}
                {i < headline.length - 1 ? <br /> : null}
              </span>
            ))}
          </h1>

          <div className='mt-6 sm:mt-8 space-y-5 text-white/[0.88] text-sm sm:text-[15px] leading-[1.75]'>
            {paragraphs.map((block, idx) => (
              <p
                key={idx}
                className='whitespace-pre-line max-w-xl [text-shadow:0_2px_20px_rgba(0,0,0,0.35)]'
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
              className='editorial-focus inline-flex min-h-[2.85rem] items-center justify-center rounded-full border border-white/30 bg-surface px-7 text-sm font-semibold text-ink transition-colors hover:bg-primarySoft'
            >
              {t('landing.hero.primaryCta')}
            </a>
            <Link
              href={t('landing.hero.servicesAnchor')}
              className='editorial-focus inline-flex min-h-[2.85rem] items-center justify-center rounded-full border border-white/35 bg-transparent px-7 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10'
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
      </div>
    </section>
  );
};

export default HomeHero;
