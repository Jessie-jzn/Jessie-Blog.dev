import { GetStaticProps } from 'next';
import { NOTION_POST_ID } from '@/lib/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';
import getLocalizedCategoryPosts from '@/lib/notion/getLocalizedCategoryPosts';
import { useTranslation } from 'next-i18next';
import PageHeader from '@/components/common/PageHeader';
import SectionHeader from '@/components/common/SectionHeader';
import EditorialArticleCard from '@/components/articles/EditorialArticleCard';
import type { Post } from '@/lib/type';

// --- 动画配置 (保持原有的顺滑质感) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// --- 新增：阶段导航 (Roadmap Navigation) ---
const RoadmapNav = () => {
  const { t } = useTranslation('common');
  const steps = [
    {
      title: t('whvPage.roadmap.prep.title'),
      icon: '✈️',
      desc: t('whvPage.roadmap.prep.description'),
    },
    {
      title: t('whvPage.roadmap.landing.title'),
      icon: '🐨',
      desc: t('whvPage.roadmap.landing.description'),
    },
    {
      title: t('whvPage.roadmap.work.title'),
      icon: '💼',
      desc: t('whvPage.roadmap.work.description'),
    },
    {
      title: t('whvPage.roadmap.departure.title'),
      icon: '💰',
      desc: t('whvPage.roadmap.departure.description'),
    },
  ];

  return (
    <div className='site-container'>
      <div className='grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4'>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className='editorial-card p-4 text-center md:p-5'
          >
            <div className='text-2xl md:text-3xl mb-2 opacity-95'>{step.icon}</div>
            <div className='text-[13px] font-semibold tracking-tight text-ink'>
              {step.title}
            </div>
            <div className='mt-0.5 text-[11px] text-subtle'>
              {step.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale = 'zh' }) => {
  const { posts, translations } = await getLocalizedCategoryPosts({
    locale,
    pageId: NOTION_POST_ID,
    from: 'whv-index',
    categories: ['whv-en', 'whv-zh'], // 确保这里获取的是 WHV 相关的分类
    useCache: true,
  });

  return {
    props: {
      posts: posts,
      ...translations,
    },
    revalidate: 10,
  };
};

const WhvListPage = ({ posts }: any) => {
  const { t } = useTranslation('common');

  return (
    <div className='min-h-screen bg-canvas pb-16 text-ink sm:pb-20'>
      {/* 1. 专题头部 */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <PageHeader
          align='center'
          eyebrow={t('whvPage.badge')}
          title={
            <>
              {t('whvPage.titleBefore')}{' '}
              <span className='text-primaryStrong'>
                {t('whvPage.titleHighlight')}
              </span>{' '}
              {t('whvPage.titleAfter')}
            </>
          }
          description={t('whvPage.description')}
        />
      </motion.div>

      {/* 2. 阶段导航 (Roadmap) */}
      <RoadmapNav />

      <div className='site-container pt-16 md:pt-24'>
        <div className='flex flex-col gap-10 lg:flex-row lg:gap-12'>
          {/* 左侧：主要内容流 */}
          <div className='min-w-0 lg:w-2/3'>
            <SectionHeader
              title={t('whvPage.latest')}
              subtitle={t('whvPage.articleCount', { count: posts?.length || 0 })}
              readMoreLink=''
            />

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='space-y-6'
            >
              {posts?.map((post: Post, index: number) => (
                <motion.div key={post.id} variants={itemVariants}>
                  <EditorialArticleCard
                    article={post}
                    variant='row'
                    priority={index === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* 右侧：个人简介 */}
          <div className='space-y-8 lg:w-1/3'>
            {/* 个人简介卡片 */}
            <aside className='editorial-surface sticky top-24 rounded-2xl p-6'>
              <div className='relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full bg-muted'>
                <Image
                  src='/images/avatar.png'
                  alt='Profile'
                  fill
                  className='object-cover'
                />
              </div>
              <h3 className='mb-2 text-center text-lg font-semibold tracking-tight text-ink'>
                {t('whvPage.aboutTitle')}
              </h3>
              <p className='mb-6 text-center text-[13px] leading-relaxed text-subtle'>
                {t('whvPage.aboutDescription')}
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <a
                  href='https://www.xiaohongshu.com/user/profile/589b257e6a6a693355986f61'
                  className='editorial-focus block rounded-full border border-line bg-primary py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-primaryStrong hover:text-surface'
                >
                  小红书
                </a>
                <a
                  href='https://www.instagram.com/jessi_e5166/'
                  className='editorial-focus block rounded-full border border-line bg-muted py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-primarySoft'
                >
                  Instagram
                </a>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhvListPage;
