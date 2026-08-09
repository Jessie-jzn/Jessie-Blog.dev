import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CommonSEO } from '@/components/SEO';
import PageHeader from '@/components/common/PageHeader';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'en', ['common', 'about'])),
    },
  };
};

const ease = [0.23, 1, 0.32, 1];
const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease } },
  viewport: { once: true, margin: '-40px' },
});

const About = () => {
  const { t } = useTranslation('about');

  return (
    <>
      <CommonSEO
        title={t('hero.title', { ns: 'about' })}
        description={t('hero.subtitle', { ns: 'about' })}
      />
      <div className='bg-canvas text-ink'>
        <PageHeader
          eyebrow={t('sections.story.title', { defaultValue: 'About Jessie' })}
          title={t('hero.title')}
          description={t('hero.subtitle')}
        />

        <main className='site-container pb-16 font-sans md:pb-24'>
          <div className='mx-auto max-w-4xl'>
        {/* Hero Section */}
        <motion.div
          className='mb-16 flex justify-center md:mb-20'
          {...fade(0.1)}
        >
          <div className='flex-shrink-0'>
            <div className='relative h-28 w-28 overflow-hidden rounded-full border border-line sm:h-36 sm:w-36'>
              <Image
                src='/images/avatar.png'
                alt='Jessie'
                fill
                className='object-cover'
                priority
              />
            </div>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div className='mb-20 xs:mb-12 max-w-3xl' {...fade(0.15)}>
          <div className='mb-8 h-px w-8 bg-line' />
          <div className='space-y-5'>
            <p className='text-base leading-[1.9] text-subtle sm:text-lg'>
              {t('sections.story.p1')}
            </p>
            <p className='text-base leading-[1.9] text-subtle sm:text-lg'>
              {t('sections.story.p2')}
            </p>
          </div>
        </motion.div>

        {/* What to find here */}
        <motion.div className='mb-20 xs:mb-12' {...fade(0.1)}>
          <h2 className='mb-8 text-sm uppercase tracking-widest text-subtle'>
            {t('sections.findHere.title')}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
            {['travel', 'tech', 'life'].map((key) => (
              <div
                key={key}
                className='editorial-surface rounded-2xl p-6'
              >
                <h3 className='mb-2 text-base font-medium text-ink'>
                  {t(`sections.findHere.${key}.title`)}
                </h3>
                <p className='text-sm leading-relaxed text-subtle'>
                  {t(`sections.findHere.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div className='mb-20 xs:mb-12' {...fade(0.1)}>
          <h2 className='mb-8 text-sm uppercase tracking-widest text-subtle'>
            {t('sections.techStack.title')}
          </h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-8'>
            {[
              {
                label: t('sections.techStack.frontend'),
                items: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'Redux & React Query'],
              },
              {
                label: t('sections.techStack.backend'),
                items: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL'],
              },
              {
                label: t('sections.techStack.tools'),
                items: ['Git & GitHub', 'VS Code', 'Docker', 'Figma'],
              },
              {
                label: t('sections.techStack.exploring'),
                items: ['AI / LLM', 'Python', 'Prompt Engineering', 'RAG'],
              },
            ].map((group) => (
              <div key={group.label}>
                <h3 className='mb-3 text-sm font-medium text-ink'>
                  {group.label}
                </h3>
                <ul className='space-y-1.5'>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className='text-sm text-subtle'
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Journey Section */}
        <motion.div className='mb-20 xs:mb-12 max-w-3xl' {...fade(0.1)}>
          <h2 className='mb-8 text-sm uppercase tracking-widest text-subtle'>
            {t('sections.journey.title')}
          </h2>
          <p className='mb-8 text-base leading-[1.9] text-subtle sm:text-lg'>
            {t('sections.journey.description')}
          </p>
          <div>
            <h3 className='mb-4 text-sm font-medium text-ink'>
              {t('sections.journey.background.title')}
            </h3>
            <ul className='space-y-3'>
              {['experience', 'skills', 'ai', 'whv'].map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary' />
                  <span className='text-sm leading-relaxed text-subtle sm:text-base'>
                    {t(`sections.journey.background.${item}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Current Location */}
        <motion.div
          className='editorial-surface mb-20 rounded-2xl p-6 xs:mb-12 sm:p-8'
          {...fade(0.1)}
        >
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='w-full md:w-2/3'>
              <h2 className='mb-4 text-sm uppercase tracking-widest text-subtle'>
                {t('sections.location.title')}
              </h2>
              <p className='mb-6 text-base leading-[1.9] text-subtle'>
                {t('sections.location.desc')}
              </p>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h3 className='mb-3 text-sm font-medium text-ink'>
                    {t('sections.location.recent')}
                  </h3>
                  <ul className='space-y-1.5 text-sm text-subtle'>
                    <li>{t('sections.location.cities.sydney')}, NSW</li>
                    <li>{t('sections.location.cities.goldCoast')}, QLD</li>
                    <li>{t('sections.location.cities.melbourne')}, VIC</li>
                    <li>{t('sections.location.cities.byronBay')}, NSW</li>
                  </ul>
                </div>
                <div>
                  <h3 className='mb-3 text-sm font-medium text-ink'>
                    {t('sections.location.next')}
                  </h3>
                  <ul className='space-y-1.5 text-sm text-subtle'>
                    <li>{t('sections.location.cities.perth')}, WA</li>
                    <li>{t('sections.location.cities.adelaide')}, SA</li>
                    <li>{t('sections.location.cities.tasmania')}</li>
                    <li>{t('sections.location.cities.gbr')}</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className='w-full md:w-1/3'>
              <div className='relative aspect-[4/3] w-full rounded-xl overflow-hidden'>
                <Image
                  src='/images/australia-map.JPG'
                  alt='Australia Travel Map'
                  fill
                  sizes='(max-width: 768px) 100vw, 33vw'
                  className='object-cover'
                  quality={90}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Philosophy / Closing Section */}
        <motion.div className='mb-20 xs:mb-12' {...fade(0.1)}>
          <div className='flex flex-col md:flex-row items-center gap-10'>
            <div className='w-full md:w-2/5'>
              <div className='relative aspect-[4/3] w-full overflow-hidden rounded-2xl'>
                <Image
                  src='https://img.jessieontheroad.com/icon/Telecommuting-cuate.png'
                  alt='Code & Life'
                  fill
                  className='object-cover'
                  sizes='(max-width: 768px) 100vw, 40vw'
                  quality={90}
                />
              </div>
            </div>

            <div className='w-full md:w-3/5 space-y-5'>
              <h2 className='mb-2 text-sm uppercase tracking-widest text-subtle'>
                {t('sections.philosophy.title')}
              </h2>

              <p className='text-lg leading-snug tracking-tight text-ink sm:text-xl'>
                {t('sections.philosophy.slogan')}
              </p>

              <p className='text-base leading-[1.9] text-subtle'>
                {t('sections.philosophy.codeDesc')}
              </p>
              <p className='text-base leading-[1.9] text-subtle'>
                {t('sections.philosophy.lifeDesc')}
              </p>

              <blockquote className='mt-6 border-l-2 border-primary py-1 pl-5'>
                <p className='text-base italic leading-relaxed text-subtle'>
                  {t('sections.philosophy.quote')}
                </p>
                <footer className='mt-1.5 text-sm text-subtle'>
                  {t('sections.philosophy.quoteAuthor')}
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default About;
