/** 渲染首页技术文章栏目。 */
import { useTranslation } from 'next-i18next';
import HomeSectionHeading from '@/components/home/HomeSectionHeading';
import GuidePostCards from '@/components/home/GuidePostCards';
import HomePageSection from '@/components/home/HomePageSection';
import type { Post } from '@/lib/type';

const TechnicalGuideSection = ({ posts }: { posts: Post[] }) => {
  const { t } = useTranslation('home');

  if (!posts?.length) return null;

  return (
    <HomePageSection
      id='technical-articles'
      aria-label={t('landing.aria.technical')}
    >
        <HomeSectionHeading
          display='AI & TECH'
          title={t('landing.technicalSection.title')}
          description={t('landing.technicalSection.subtitle')}
          href='/technical'
        />

      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default TechnicalGuideSection;
