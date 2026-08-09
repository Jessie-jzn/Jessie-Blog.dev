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
      <strong className='font-medium text-ink'>
        {t('landing.travelSection.introStrong')}
      </strong>
      {t('landing.travelSection.introLine2After')}
    </p>
  );

  if (!posts?.length) return null;

  return (
    <HomePageSection id={sectionId} aria-label={t('landing.aria.travel')}>
      <div className='mb-8 border-b border-line pb-8 md:mb-10 md:pb-10'>
        <SectionHeader
          variant='editorial'
          editorialKicker={kicker}
          title={ttl}
          subtitle={sub}
          readMoreLink='/travel'
        />
        <div className='mt-6 border-l border-primary pl-5 text-sm leading-relaxed text-subtle md:mt-8 md:text-[15px]'>
          {intro ?? defaultIntro}
        </div>
      </div>
      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default TravelGuideSection;
