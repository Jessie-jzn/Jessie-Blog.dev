import { useTranslation } from 'next-i18next';
import type { ReactNode } from 'react';
import SectionHeader from '@/components/common/SectionHeader';
import GuidePostCards from '@/components/home/GuidePostCards';
import HomePageSection from '@/components/home/HomePageSection';
import * as Types from '@/lib/type';

interface TravelGuideSectionProps {
  posts: Types.Post[];
  sectionId?: string;
  editorialKicker?: string;
  title?: string;
  subtitle?: string;
  intro?: ReactNode;
}

const TravelGuideSection = ({
  posts,
  sectionId = 'travel-guides',
  editorialKicker,
  title,
  subtitle,
  intro,
}: TravelGuideSectionProps) => {
  const { t } = useTranslation('home');

  const kicker = editorialKicker ?? t('landing.travelSection.kicker');
  const ttl = title ?? t('landing.travelSection.title');
  const sub = subtitle ?? t('landing.travelSection.subtitle');

  const defaultIntro = (
    <p>
      {t('landing.travelSection.introLine1')}
      <br />
      <br />
      {t('landing.travelSection.introLine2Before')}
      <strong className='font-medium text-neutral-800 dark:text-neutral-200'>
        {t('landing.travelSection.introStrong')}
      </strong>
      {t('landing.travelSection.introLine2After')}
    </p>
  );

  if (!posts?.length) return null;

  return (
    <HomePageSection id={sectionId} aria-label={t('landing.aria.travel')}>
      <div className='border-b border-neutral-100 dark:border-white/[0.07] pb-8 md:pb-10 mb-8 md:mb-10'>
        <SectionHeader
          variant='editorial'
          editorialKicker={kicker}
          title={ttl}
          subtitle={sub}
          readMoreLink='/travel'
        />
        <div className='mt-6 md:mt-8 p-4 md:p-5 rounded-2xl bg-stone-50 dark:bg-neutral-800/80 text-sm md:text-[15px] text-neutral-600 dark:text-neutral-300 leading-relaxed'>
          {intro ?? defaultIntro}
        </div>
      </div>
      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default TravelGuideSection;
