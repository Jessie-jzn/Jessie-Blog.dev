/** 渲染可配置的旅行指南栏目，并将文章列表交给指南卡片展示。 */
import { useTranslation } from 'next-i18next';
import HomeSectionHeading from '@/components/home/HomeSectionHeading';
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

  const ttl = title ?? t('landing.travelSection.title');
  const sub = subtitle ?? t('landing.travelSection.subtitle');

  if (!posts?.length) return null;

  return (
    <HomePageSection id={sectionId} aria-label={t('landing.aria.travel')}>
        <HomeSectionHeading
          display={editorialKicker || 'ON THE ROAD'}
          title={ttl}
          description={sub}
          href='/travel'
        />
      <GuidePostCards posts={posts} layout='photos' />
    </HomePageSection>
  );
};

export default TravelGuideSection;
