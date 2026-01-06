import { GetStaticProps } from 'next';
import NotionService from '@/lib/notion/NotionServer';
import { NOTION_HOME_ID, NOTION_POST_ID } from '@/lib/constants';
import SiteConfig from '@/site.config';
import HomeLayout from '@/components/layouts/HomeLayout';
import getDataBaseList from '@/lib/notion/getDataBaseList';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { CommonSEO } from '@/components/SEO';
import { useTranslation } from 'next-i18next';
import { motion } from 'framer-motion';
import * as Types from '@/lib/type';
// --- 引入拆分后的组件 ---
import Carousel from '@/components/home/Carousel';
import AffiliateToolbox from '@/components/home/AffiliateToolbox';
import WhvGuideSection from '@/components/home/WhvGuideSection';
import TravelGuideSection from '@/components/home/TravelGuideSection';
import AdBanner from '@/components/common/AdBanner';
import RouteSection from '@/components/home/RouteSection';
import GallerySection from '@/components/home/GallerySection';
import TestimonialSection from '@/components/home/TestimonialSection';

const notionService = new NotionService();

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let posts = [] as any;
  let whvPosts = [];
  let travelPosts = [];

  // 数据获取逻辑保持不变...
  if (!SiteConfig.useCustomHomeLayout) {
    posts = await notionService.getPage(NOTION_HOME_ID);
  } else {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: 'home-index',
    });
    posts = response?.allPages || [];
    whvPosts = posts
      .filter(
        (p: Types.Post) =>
          (p.category || '').toLowerCase().includes('whv') ||
          (p.category || '').toLowerCase().includes('job')
      )
      .slice(0, 6);
    travelPosts = posts
      .filter((p: Types.Post) =>
        (p.category || '').toLowerCase().includes('travel')
      )
      .slice(0, 6);

    if (whvPosts.length === 0) whvPosts = posts.slice(0, 4);
    if (travelPosts.length === 0) travelPosts = posts.slice(0, 8);
  }

  return {
    props: {
      whvPosts,
      travelPosts,
      ...(await serverSideTranslations(locale || 'zh', ['common', 'home'])),
    },
    revalidate: 10,
  };
};

const Home = ({ whvPosts, travelPosts }: any) => {
  const { t } = useTranslation(['home', 'common']);

  // 轮播图数据也可以提出来，或者传给 Carousel 组件
  const carouselSlides = [
    {
      image: 'https://img.jessieontheroad.com/image4.jpg',
      title: t('hero.title'),
      description: t('hero.subtitle'),
      href: '/about',
    },
    {
      image: 'https://img.jessieontheroad.com/image4.jpg',
      title: t('whver.title'),
      description: t('whver.description'),
      href: '/whv',
    },
    {
      image: 'https://img.jessieontheroad.com/image6.jpg',
      title: t('travel.title'),
      description: t('travel.description'),
      href: '/travel',
    },
    {
      image: 'https://img.jessieontheroad.com/image2.jpg',
      title: t('technical.title'),
      description: t('technical.description'),
      href: '/technical',
    },
  ];

  return (
    <div className='bg-white dark:bg-gray-950 min-h-screen'>
      <CommonSEO
        title={t('hero.title', { ns: 'common' })}
        description={t('hero.subtitle', { ns: 'common' })}
      />

      <main>
        {/* 1. Hero 区域 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='relative'
        >
          <Carousel slides={carouselSlides} />
          <div className='absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white dark:from-gray-950 to-transparent z-10' />
        </motion.div>

        {/* 2. 工具箱区域 */}
        <div className='container mx-auto px-4 relative z-20 -mt-16 md:-mt-20 mb-16'>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className='bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-800'
          >
            <div className='flex items-center justify-between mb-4'>
              <h3 className='text-xs font-bold text-gray-400 uppercase tracking-wider'>
                Australia WHV Toolkit
              </h3>
              <span className='text-xs text-[#62BFAD] font-medium'>
                省钱指南 →
              </span>
            </div>
            <AffiliateToolbox />
          </motion.div>
        </div>

        {/* 3. WHV 攻略模块 */}
        <WhvGuideSection posts={whvPosts} />

        {/* 4. 广告位 */}
        <div className='container mx-auto px-4'>
          <AdBanner label='澳洲本地服务推荐' />
        </div>

        {/* 5. 旅游攻略模块 */}
        <TravelGuideSection posts={travelPosts} />

        {/* 6. 路线推荐 */}
        <RouteSection />

        {/* 7. 视觉画廊 */}
        <GallerySection />

        {/* 8. 用户评价 */}
        <TestimonialSection />
      </main>
    </div>
  );
};

Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
