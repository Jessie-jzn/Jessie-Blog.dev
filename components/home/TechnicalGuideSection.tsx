/** 渲染首页技术文章栏目。 */
import { useTranslation } from 'next-i18next';
import SectionHeader from '@/components/common/SectionHeader';
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
      <div className='mb-8 border-b border-line pb-8 md:mb-10 md:pb-10'>
        <SectionHeader
          variant='editorial'
          editorialKicker={t('landing.technicalSection.kicker')}
          title={t('landing.technicalSection.title')}
          subtitle={t('landing.technicalSection.subtitle')}
          readMoreLink='/technical'
        />
      </div>

      <GuidePostCards posts={posts} />
    </HomePageSection>
  );
};

export default TechnicalGuideSection;
