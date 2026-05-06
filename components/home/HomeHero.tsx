import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useTranslation } from 'next-i18next';

const consultMailHref = (
  email: string,
  subject: string,
  body?: string,
) => {
  const q = [`subject=${encodeURIComponent(subject)}`];
  if (body) q.push(`body=${encodeURIComponent(body)}`);
  return `mailto:${email}?${q.join('&')}`;
};

interface HomeHeroProps {
  email: string;
}

const HomeHero: React.FC<HomeHeroProps> = ({ email }) => {
  const { t } = useTranslation('home');
  const mailTemplate = t('landing.hero.mailTemplate');
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

      <div className='relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 lg:px-10 pb-12 md:pb-14 pt-32 md:pt-36'>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className='max-w-2xl'
        >
          <p className='inline-flex items-center gap-2 rounded-full bg-white/[0.14] backdrop-blur-md px-3.5 py-1.5 text-[11px] font-medium tracking-wide text-white/92 ring-1 ring-white/25 mb-5'>
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
              href={consultMailHref(
                email,
                t('landing.hero.primaryMailSubject'),
                mailTemplate,
              )}
              className='inline-flex items-center justify-center min-h-[2.85rem] px-7 rounded-full bg-white text-neutral-950 text-sm font-semibold hover:bg-[#eef8f5] transition-colors shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)]'
            >
              {t('landing.hero.primaryCta')}
            </a>
            <Link
              href={t('landing.hero.servicesAnchor')}
              className='inline-flex items-center justify-center min-h-[2.85rem] px-7 rounded-full bg-transparent text-white text-sm font-medium ring-2 ring-white/35 hover:bg-white/10 backdrop-blur-sm transition-colors'
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
