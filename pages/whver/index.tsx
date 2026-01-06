import { GetStaticProps } from 'next';
import { NOTION_POST_ID } from '@/lib/constants';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import getLocalizedCategoryPosts from '@/lib/notion/getLocalizedCategoryPosts';
import { useTranslation } from 'next-i18next'; // 引入翻译钩子
import AdBanner from '@/components/common/AdBanner';

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

// --- 新增：专题页头部组件 (Guide Header) ---
const TopicHeader = () => (
  <div className='relative py-16 md:py-24 bg-gray-50 dark:bg-gray-900 overflow-hidden'>
    <div className='absolute inset-0 opacity-10 dark:opacity-20 pattern-grid-lg text-[#62BFAD]' />
    <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='inline-block py-1 px-3 rounded-full bg-[#62BFAD]/10 text-[#62BFAD] text-sm font-bold tracking-wider mb-4'
      >
        ULTIMATE GUIDE
      </motion.span>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className='text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4'
      >
        澳洲打工度假 <span className='text-[#62BFAD]'>WHV</span> 全攻略
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className='max-w-2xl mx-auto text-lg text-gray-500 dark:text-gray-400'
      >
        从签证申请到落地生存，从农场集签到城市打工。这里记录了我作为 WHVer
        在澳洲的真实体验与避坑指南。
      </motion.p>
    </div>
  </div>
);

// --- 新增：阶段导航 (Roadmap Navigation) ---
const RoadmapNav = () => {
  const steps = [
    { title: '行前准备', icon: '✈️', desc: '签证/行李/机票', link: '#' }, // 实际使用时可链接到 specific tag
    { title: '落地生存', icon: '🐨', desc: '税号/银行卡/租房', link: '#' },
    { title: '工作攻略', icon: '💼', desc: '农场/肉厂/酒店', link: '#' },
    { title: '离澳退税', icon: '💰', desc: 'Super/退税流程', link: '#' },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 -mt-8 relative z-10'>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -5 }}
            className='bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 text-center cursor-pointer'
          >
            <div className='text-3xl mb-2'>{step.icon}</div>
            <div className='font-bold text-gray-900 dark:text-gray-100'>
              {step.title}
            </div>
            <div className='text-xs text-gray-500'>{step.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// --- 新增：高佣金工具条 (Monetization) ---
const ToolsBar = () => (
  <div className='max-w-7xl mx-auto px-4 mt-8 mb-12'>
    <div className='bg-[#62BFAD]/5 border border-[#62BFAD]/20 rounded-xl p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4'>
      <div className='flex items-center gap-3'>
        <div className='p-2 bg-[#62BFAD] text-white rounded-lg'>
          <svg
            className='w-6 h-6'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        </div>
        <div>
          <h3 className='font-bold text-gray-900 dark:text-gray-100'>
            WHV 新手必备工具箱
          </h3>
          <p className='text-sm text-gray-500'>汇款、保险、电话卡省钱渠道</p>
        </div>
      </div>
      <div className='flex gap-3'>
        {/* 替换为你的真实链接 */}
        <a
          href='#'
          className='px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-lg shadow-sm hover:text-[#62BFAD] transition-colors'
        >
          Wise 汇款
        </a>
        <a
          href='#'
          className='px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-lg shadow-sm hover:text-[#62BFAD] transition-colors'
        >
          保险对比
        </a>
        <a
          href='#'
          className='px-4 py-2 bg-white dark:bg-gray-800 text-sm font-medium rounded-lg shadow-sm hover:text-[#62BFAD] transition-colors'
        >
          eSIM 优惠
        </a>
      </div>
    </div>
  </div>
);

// --- 广告位 ---
const AdPlaceHolder = () => (
  <div className='w-full h-24 bg-gray-100 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-gray-400 text-sm my-8'>
    <AdBanner />
  </div>
);

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

const Whver = ({ posts }: any) => {
  const { t } = useTranslation('common');

  return (
    <div className='min-h-screen bg-white dark:bg-gray-950 pb-20'>
      {/* 1. 专题头部 */}
      <TopicHeader />

      {/* 2. 阶段导航 (Roadmap) */}
      <RoadmapNav />

      {/* 3. 变现工具条 */}
      <ToolsBar />

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col lg:flex-row gap-12'>
          {/* 左侧：主要内容流 */}
          <div className='lg:w-2/3'>
            <div className='flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-4'>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
                最新文章
              </h2>
              <span className='text-sm text-gray-500'>
                共 {posts?.length || 0} 篇攻略
              </span>
            </div>

            <motion.div
              variants={containerVariants}
              initial='hidden'
              animate='visible'
              className='space-y-8'
            >
              {posts?.map((post: any, index: number) => {
                // 每 3 篇文章插入一个广告
                const showAd = index > 0 && index % 3 === 0;

                return (
                  <div key={post.id}>
                    {showAd && <AdPlaceHolder />}

                    <motion.div variants={itemVariants} className='group'>
                      <Link href={`${post?.category}/${post?.slug || post.id}`}>
                        <div className='bg-white dark:bg-gray-900 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row h-full md:h-52'>
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
                          <div className='p-6 flex flex-col flex-grow justify-between'>
                            <div>
                              <div className='flex items-center gap-2 text-xs text-gray-500 mb-2'>
                                <time dateTime={post.lastEditedDate}>
                                  {post.lastEditedDate}
                                </time>
                                <span>•</span>
                                <span>{post.pageIcon || '📄'}</span>
                              </div>
                              <h3 className='text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-[#62BFAD] transition-colors line-clamp-2'>
                                {post.title}
                              </h3>
                              <p className='text-gray-600 dark:text-gray-400 text-sm line-clamp-2 font-light'>
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
                                      className='text-xs bg-gray-50 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded border border-gray-100 dark:border-gray-700'
                                    >
                                      #{tag}
                                    </span>
                                  ))}
                              </div>
                              <span className='text-[#62BFAD] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0'>
                                Read More →
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

          {/* 右侧：侧边栏 (Sidebar) - 适合放个人简介和广告 */}
          <div className='lg:w-1/3 space-y-8'>
            {/* 个人简介卡片 */}
            <div className='bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 sticky top-24'>
              <div className='w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 bg-gray-200 relative'>
                <Image
                  src='https://img.jessieontheroad.com/avatar.png'
                  alt='Profile'
                  fill
                  className='object-cover'
                />
              </div>
              <h3 className='text-center font-bold text-lg mb-2'>
                About Jessie
              </h3>
              <p className='text-center text-sm text-gray-500 mb-6'>
                澳洲 WHV
                二年级生。分享打工度假干货、公路旅行路线和数字游民生活。
              </p>
              <div className='grid grid-cols-2 gap-2'>
                <a
                  href='https://www.xiaohongshu.com/user/profile/589b257e6a6a693355986f61'
                  className='block py-2 text-center bg-[#62BFAD] text-white rounded-lg text-sm font-bold hover:bg-[#52a896] transition-colors'
                >
                  小红书
                </a>
                <a
                  href='https://www.instagram.com/jessi_e5166/'
                  className='block py-2 text-center bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors'
                >
                  Instagram
                </a>
              </div>

              {/* 侧边栏广告 */}
              {/* <div className='mt-8 border-t border-gray-100 dark:border-gray-800 pt-6'>
                <div className='text-xs text-gray-400 mb-2 uppercase text-center'>
                  Sponsored
                </div>
                <div className='w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-xs text-gray-400 border border-dashed border-gray-300'>
                  Sidebar Ad (Vertical)
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whver;
