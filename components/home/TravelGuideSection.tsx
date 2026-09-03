/** 渲染可配置的旅行指南栏目，并将文章列表交给指南卡片展示。 */
import { useTranslation } from 'next-i18next';
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
}

const TravelGuideSection = ({
  posts,
  sectionId = 'travel-guides',
  editorialKicker,
  title,
  subtitle,
}: TravelGuideSectionProps) => {
  const { t } = useTranslation('home');

  const kicker = editorialKicker ?? t('landing.travelSection.kicker');
  const ttl = title ?? t('landing.travelSection.title');
  const sub = subtitle ?? t('landing.travelSection.subtitle');

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
      </div>
      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default TravelGuideSection;
