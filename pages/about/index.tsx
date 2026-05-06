import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { CommonSEO } from '@/components/SEO';

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
      <div className='max-w-3xl mx-auto px-5 sm:px-6 py-10 sm:py-16 font-sans text-gray-700 dark:text-gray-300'>
        {/* Hero Section */}
        <motion.div
          className='flex flex-col md:flex-row items-center gap-10 mb-20 xs:mb-12'
          {...fade(0.1)}
        >
          <div className='flex-shrink-0'>
            <div className='relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden ring-2 ring-black/[0.06] dark:ring-white/[0.12] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.15)]'>
              <Image
                src='https://img.jessieontheroad.com/avatar.png'
                alt='Jessie'
                fill
                className='object-cover'
                priority
              />
            </div>
          </div>
          <div className='text-center md:text-left'>
            <h1 className='text-3xl sm:text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-3'>
              {t('hero.title')}
            </h1>
            <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed'>
              {t('hero.subtitle')}
            </p>
          </div>
        </motion.div>

        {/* Story Section */}
        <motion.div className='mb-20 xs:mb-12 max-w-3xl' {...fade(0.15)}>
          <div className='w-8 h-[1px] bg-gray-200 dark:bg-gray-800 mb-8' />
          <div className='space-y-5'>
            <p className='text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-[1.9]'>
              {t('sections.story.p1')}
            </p>
            <p className='text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-[1.9]'>
              {t('sections.story.p2')}
            </p>
          </div>
        </motion.div>

        {/* What to find here */}
        <motion.div className='mb-20 xs:mb-12' {...fade(0.1)}>
          <h2 className='text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-8'>
            {t('sections.findHere.title')}
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
            {['travel', 'tech', 'life'].map((key) => (
              <div
                key={key}
                className='p-6 rounded-2xl bg-gray-50/80 dark:bg-gray-900/40 border border-black/[0.03] dark:border-white/[0.03]'
              >
                <h3 className='text-base font-medium text-gray-900 dark:text-gray-100 mb-2'>
                  {t(`sections.findHere.${key}.title`)}
                </h3>
                <p className='text-sm text-gray-600 dark:text-gray-300 leading-relaxed'>
                  {t(`sections.findHere.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div className='mb-20 xs:mb-12' {...fade(0.1)}>
          <h2 className='text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-8'>
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
                <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-3'>
                  {group.label}
                </h3>
                <ul className='space-y-1.5'>
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className='text-sm text-gray-600 dark:text-gray-300'
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
          <h2 className='text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-8'>
            {t('sections.journey.title')}
          </h2>
          <p className='text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-[1.9] mb-8'>
            {t('sections.journey.description')}
          </p>
          <div>
            <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-4'>
              {t('sections.journey.background.title')}
            </h3>
            <ul className='space-y-3'>
              {['experience', 'skills', 'ai', 'whv'].map((item) => (
                <li key={item} className='flex items-start gap-3'>
                  <span className='mt-2 w-1.5 h-1.5 rounded-full bg-[#62BFAD] flex-shrink-0' />
                  <span className='text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed'>
                    {t(`sections.journey.background.${item}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Current Location */}
        <motion.div
          className='mb-20 xs:mb-12 rounded-2xl bg-gray-50/80 dark:bg-gray-900/40 border border-black/[0.03] dark:border-white/[0.03] p-6 sm:p-8'
          {...fade(0.1)}
        >
          <div className='flex flex-col md:flex-row gap-8'>
            <div className='w-full md:w-2/3'>
              <h2 className='text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-4'>
                {t('sections.location.title')}
              </h2>
              <p className='text-base text-gray-700 dark:text-gray-300 leading-[1.9] mb-6'>
                {t('sections.location.desc')}
              </p>
              <div className='grid grid-cols-2 gap-6'>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-3'>
                    {t('sections.location.recent')}
                  </h3>
                  <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-300'>
                    <li>{t('sections.location.cities.sydney')}, NSW</li>
                    <li>{t('sections.location.cities.goldCoast')}, QLD</li>
                    <li>{t('sections.location.cities.melbourne')}, VIC</li>
                    <li>{t('sections.location.cities.byronBay')}, NSW</li>
                  </ul>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-900 dark:text-gray-100 mb-3'>
                    {t('sections.location.next')}
                  </h3>
                  <ul className='space-y-1.5 text-sm text-gray-600 dark:text-gray-300'>
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
              <h2 className='text-sm text-gray-500 dark:text-gray-400 tracking-widest uppercase mb-2'>
                {t('sections.philosophy.title')}
              </h2>

              <p className='text-lg sm:text-xl text-gray-900 dark:text-gray-100 leading-snug tracking-tight'>
                {t('sections.philosophy.slogan')}
              </p>

              <p className='text-base text-gray-700 dark:text-gray-300 leading-[1.9]'>
                {t('sections.philosophy.codeDesc')}
              </p>
              <p className='text-base text-gray-700 dark:text-gray-300 leading-[1.9]'>
                {t('sections.philosophy.lifeDesc')}
              </p>

              <blockquote className='border-l-[2px] border-[#62BFAD]/60 pl-5 py-1 mt-6'>
                <p className='text-base text-gray-600 dark:text-gray-300 italic leading-relaxed'>
                  {t('sections.philosophy.quote')}
                </p>
                <footer className='text-sm text-gray-500 dark:text-gray-400 mt-1.5'>
                  {t('sections.philosophy.quoteAuthor')}
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default About;
