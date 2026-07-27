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
      <div className='mb-8 border-b border-line pb-8 md:mb-10 md:pb-10'>
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
          <Link key={i} href={step.link} className='editorial-focus group rounded-2xl'>
            <div className='h-full rounded-2xl border border-line bg-muted px-2 py-3.5 text-center transition-colors duration-300 group-hover:border-primary/40 group-hover:bg-primarySoft md:py-5'>
              <div className='text-lg md:text-2xl mb-1 md:mb-2 opacity-95'>
                {step.icon}
              </div>
              <h3 className='text-[11px] font-semibold text-ink md:text-xs'>
                {stepTitles[i] ?? step.title}
              </h3>
              <div className='mt-0.5 text-[10px] text-subtle'>
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
