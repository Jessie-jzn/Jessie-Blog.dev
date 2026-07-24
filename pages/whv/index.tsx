import { GetStaticProps } from 'next';
import { NOTION_POST_ID } from '@/lib/constants';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import getLocalizedCategoryPosts from '@/lib/notion/getLocalizedCategoryPosts';
import { useTranslation } from 'next-i18next';

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

interface TopicHeaderProps {
  badge: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  description: string;
}

// --- 专题页头部组件 ---
// framer-motion 的 initial/animate 在 SSR 时会对文本节点做双重渲染导致 hydration mismatch，
// 用 dynamic + ssr:false 让整个头部只在客户端渲染，避免 "ULTIMATEULTIMATE GUIDEGUIDE" 问题。
const TopicHeader = dynamic<TopicHeaderProps>(
  () =>
    Promise.resolve(
      ({
        badge,
        titleBefore,
        titleHighlight,
        titleAfter,
        description,
      }: TopicHeaderProps) => (
      <div className='relative py-12 md:py-16 px-4'>
        <div className='relative max-w-3xl mx-auto text-center'>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='inline-flex items-center px-3 py-1 rounded-full bg-white/80 dark:bg-neutral-900/80 ring-1 ring-black/[0.06] dark:ring-white/[0.08] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#4a9e8f] dark:text-[#62BFAD] mb-5'
          >
            {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='text-[1.75rem] md:text-[2.25rem] font-semibold tracking-[-0.03em] text-neutral-950 dark:text-white leading-snug mb-4'
          >
            {titleBefore}{' '}
            <span className='text-[#62BFAD]'>{titleHighlight}</span>{' '}
            {titleAfter}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className='max-w-xl mx-auto text-[15px] text-neutral-600 dark:text-neutral-400 leading-relaxed'
          >
            {description}
          </motion.p>
        </div>
      </div>
      ),
    ),
  { ssr: false }
);

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
    <div className='max-w-6xl mx-auto px-4 sm:px-5 -mt-4 relative z-10'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3'>
        {steps.map((step, idx) => (
          <div
            key={idx}
            className='bg-white/90 dark:bg-neutral-900/75 backdrop-blur-sm p-4 md:p-5 rounded-2xl ring-1 ring-black/[0.05] dark:ring-white/[0.08] text-center'
          >
            <div className='text-2xl md:text-3xl mb-2 opacity-95'>{step.icon}</div>
            <div className='text-[13px] font-semibold tracking-tight text-neutral-900 dark:text-white'>
              {step.title}
            </div>
            <div className='text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5'>
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
    <div className='pb-16 sm:pb-20'>
      {/* 1. 专题头部 */}
      <TopicHeader
        badge={t('whvPage.badge')}
        titleBefore={t('whvPage.titleBefore')}
        titleHighlight={t('whvPage.titleHighlight')}
        titleAfter={t('whvPage.titleAfter')}
        description={t('whvPage.description')}
      />

      {/* 2. 阶段导航 (Roadmap) */}
      <RoadmapNav />

      <div className='max-w-6xl mx-auto px-4 sm:px-5'>
        <div className='flex flex-col lg:flex-row gap-10 lg:gap-12'>
          {/* 左侧：主要内容流 */}
          <div className='lg:w-2/3'>
            <div className='flex items-center justify-between mb-8 border-b border-black/[0.06] dark:border-white/[0.08] pb-4'>
              <h2 className='text-xl md:text-[1.35rem] font-semibold tracking-tight text-neutral-950 dark:text-white'>
                {t('whvPage.latest')}
              </h2>
              <span className='text-[13px] text-neutral-500 dark:text-neutral-400'>
                {t('whvPage.articleCount', { count: posts?.length || 0 })}
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='space-y-8'
            >
              {posts?.map((post: any) => {
                return (
                  <div key={post.id}>
                    <motion.div variants={itemVariants} className='group'>
                      <Link href={`${post?.category}/${post?.slug || post.id}`}>
                        <div className='bg-white/95 dark:bg-neutral-900/75 rounded-[1.25rem] overflow-hidden hover:shadow-[0_12px_40px_-16px_rgba(0,0,0,0.12)] transition-all duration-300 ring-1 ring-black/[0.05] dark:ring-white/[0.08] flex flex-col md:flex-row h-full md:h-52'>
                          {/* 图片区域 - 移动端在上，桌面端在左 */}
                          <div className='w-full md:w-52 h-48 md:h-full relative flex-shrink-0 overflow-hidden'>
                            <Image
                              src={post.pageCover}
                              alt={post.title}
                              fill
                              className='object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            {/* 类别标签 (左上角) */}
                            <div className='absolute top-2 left-2'>
                              <span className='px-2 py-1 bg-black/60 backdrop-blur-md text-white text-[10px] rounded uppercase tracking-wide'>
                                {post.tags?.[0] || 'GUIDE'}
                              </span>
                            </div>
                          </div>

                          {/* 内容区域 */}
                          <div className='p-5 md:p-6 flex flex-col flex-grow justify-between'>
                            <div>
                              <div className='flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mb-2'>
                                <time dateTime={post.lastEditedDate}>
                                  {post.lastEditedDate}
                                </time>
                                <span>•</span>
                                <span>{post.pageIcon || '📄'}</span>
                              </div>
                              <h3 className='text-base md:text-lg font-semibold tracking-tight text-neutral-900 dark:text-white mb-2 group-hover:text-[#62BFAD] transition-colors line-clamp-2'>
                                {post.title}
                              </h3>
                              <p className='text-neutral-600 dark:text-neutral-400 text-[13px] line-clamp-2 leading-relaxed'>
                                {post.summarize}
                              </p>
                            </div>

                            {/* 底部标签区域 */}
                            <div className='flex items-center justify-between mt-4'>
                              <div className='flex gap-2'>
                                {(post.tags || [])
                                  .slice(0, 2)
                                  .map((tag: string) => (
                                    <span
                                      key={tag}
                                      className='text-[10px] bg-stone-50 dark:bg-neutral-800/90 text-neutral-500 dark:text-neutral-400 px-2 py-1 rounded-full ring-1 ring-black/[0.04] dark:ring-white/[0.08]'
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                              </div>
                              <span className='text-[#62BFAD] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0'>
                                {t('whvPage.readMore')} →
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* 右侧：个人简介 */}
          <div className='lg:w-1/3 space-y-8'>
            {/* 个人简介卡片 */}
            <div className='bg-white/90 dark:bg-neutral-900/75 backdrop-blur-sm p-6 rounded-[1.25rem] ring-1 ring-black/[0.05] dark:ring-white/[0.08] sticky top-24'>
              <div className='w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 relative'>
                <Image
                  src='https://img.jessieontheroad.com/avatar.png'
                  alt='Profile'
                  fill
                  className='object-cover'
                />
              </div>
              <h3 className='text-center font-semibold tracking-tight text-lg mb-2 text-neutral-900 dark:text-white'>
                {t('whvPage.aboutTitle')}
              </h3>
              <p className='text-center text-[13px] text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed'>
                {t('whvPage.aboutDescription')}
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <a
                  href='https://www.xiaohongshu.com/user/profile/589b257e6a6a693355986f61'
                  className='block py-2.5 text-center bg-[#62BFAD] text-white rounded-full text-sm font-semibold hover:bg-[#52a896] transition-colors'
                >
                  小红书
                </a>
                <a
                  href='https://www.instagram.com/jessi_e5166/'
                  className='block py-2.5 text-center bg-stone-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-full text-sm font-semibold hover:bg-stone-200 dark:hover:bg-neutral-700 transition-colors'
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhvListPage;
