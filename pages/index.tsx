import { GetStaticProps } from 'next';
import NotionService from '@/lib/notion/NotionServer';
import { NOTION_HOME_ID, NOTION_POST_ID } from '@/lib/constants';
import SiteConfig from '@/site.config';
import HomeLayout from '@/components/layouts/HomeLayout';
import getDataBaseList from '@/lib/notion/getDataBaseList';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import { CommonSEO } from '@/components/SEO';
import * as Types from '@/lib/type';
import HomeHero from '@/components/home/HomeHero';
import HomePersonaStory from '@/components/home/HomePersonaStory';
import HomeLandingSections from '@/components/home/HomeLandingSections';
import HomeToolsSection from '@/components/home/HomeToolsSection';
import WhvGuideSection from '@/components/home/WhvGuideSection';
import TravelGuideSection from '@/components/home/TravelGuideSection';
import HomeConsultCta from '@/components/home/HomeConsultCta';

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let posts = [] as Types.Post[];
  let whvPosts: Types.Post[] = [];
  let travelPosts: Types.Post[] = [];

  if (!SiteConfig.useCustomHomeLayout) {
    posts = (await notionService.getPage(NOTION_HOME_ID)) as unknown as Types.Post[];
  } else {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: 'home-index',
    });
    posts = (response?.allPages || []) as Types.Post[];

    whvPosts = posts
      .filter(
        (p) =>
          (p.category || '').toLowerCase().includes('whv') ||
          (p.category || '').toLowerCase().includes('job')
      )
      .slice(0, 6);

    travelPosts = posts
      .filter((p) =>
        (p.category || '').toLowerCase().includes('travel')
      )
      .slice(0, 12);

    if (whvPosts.length === 0) whvPosts = posts.slice(0, 4);
    if (travelPosts.length === 0) {
      travelPosts = posts.filter(
        (p) => !whvPosts.some((w) => w.id === p.id)
      ).slice(0, 12);
      if (travelPosts.length === 0) travelPosts = posts.slice(0, 12);
    }
  }

  return {
    props: {
      whvPosts,
      travelPosts,
      ...(await serverSideTranslations(locale || 'en', ['common', 'home'])),
    },
    revalidate: 10,
  };
};

interface HomeProps {
  whvPosts: Types.Post[];
  travelPosts: Types.Post[];
}

const Home = ({ whvPosts, travelPosts }: HomeProps) => {
  const { t } = useTranslation('home');

  return (
    <div className='min-h-screen bg-canvas dark:bg-neutral-950'>
      <CommonSEO
        title={t('landing.seoTitle')}
        description={t('landing.seoDescription')}
      />

      <main>
        <HomeHero email={SiteConfig.email} />

        <div className='relative z-10 max-w-6xl mx-auto px-3.5 sm:px-5 pb-12 md:pb-16 flex flex-col gap-3.5 sm:gap-4 md:-mt-8'>
          <HomePersonaStory />

          <TravelGuideSection sectionId='travel-guides' posts={travelPosts} />

          <HomeLandingSections />

          <WhvGuideSection posts={whvPosts} />

          <HomeToolsSection />

          <HomeConsultCta />
        </div>
      </main>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
