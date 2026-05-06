import Link from 'next/link';
import type { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import SectionHeader from '@/components/common/SectionHeader';
import GuidePostCards from '@/components/home/GuidePostCards';
import HomePageSection from '@/components/home/HomePageSection';
import * as Types from '@/lib/type';

const whvSteps = [
  {
    title: '行前',
    icon: '✈️',
    link: '/tag/preparation',
    desc: '签证',
  },
  { title: '落地', icon: '🇦🇺', link: '/tag/landing', desc: '卡 / 税号' },
  { title: '工作', icon: '💼', link: '/tag/jobs', desc: '求职' },
  { title: '离境', icon: '💰', link: '/tag/tax', desc: '退税' },
];

interface WhvGuideSectionProps {
  posts: Types.Post[];
  sectionId?: string;
  title?: string;
  subtitle?: string;
  editorialKicker?: string;
  intro?: ReactNode;
}

const WhvGuideSection = ({
  posts,
  sectionId = 'whv-guides',
  title,
  subtitle,
  editorialKicker,
  intro,
}: WhvGuideSectionProps) => {
  const { t, i18n } = useTranslation('home');

  const ttl = title ?? t('landing.whv.title');
  const sub = subtitle ?? t('landing.whv.subtitle');
  const kicker = editorialKicker ?? t('landing.whv.kicker');
  const defaultIntro = (
    <p>{t('landing.whv.intro')}</p>
  );

  const stepTitles =
    i18n.language === 'en'
      ? ['Prep', 'Landing', 'Jobs', 'Exit']
      : whvSteps.map((s) => s.title);
  const stepDescs =
    i18n.language === 'en'
      ? ['Visa', 'Cards / TFN', 'Finding work', 'Tax / depart']
      : whvSteps.map((s) => s.desc);

  return (
    <HomePageSection id={sectionId} aria-label={t('landing.aria.whv')}>
      <div className='border-b border-neutral-100 dark:border-white/[0.07] pb-8 md:pb-10 mb-8 md:mb-10'>
        <SectionHeader
          variant='editorial'
          editorialKicker={kicker}
          title={ttl}
          subtitle={sub}
          readMoreLink='/whv'
        />
      </div>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-4 mb-10 md:mb-12'>
        {whvSteps.map((step, i) => (
          <Link key={i} href={step.link} className='group'>
            <div className='h-full rounded-2xl bg-stone-50 dark:bg-neutral-800/60 px-2 py-3.5 md:py-5 text-center transition-all duration-300 group-hover:bg-[#62BFAD]/12 group-hover:ring-2 group-hover:ring-[#62BFAD]/35 dark:group-hover:bg-[#62BFAD]/15'>
              <div className='text-lg md:text-2xl mb-1 md:mb-2 opacity-95'>
                {step.icon}
              </div>
              <h3 className='text-[11px] md:text-xs font-semibold text-neutral-900 dark:text-white'>
                {stepTitles[i] ?? step.title}
              </h3>
              <div className='text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5'>
                {stepDescs[i]}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default WhvGuideSection;
