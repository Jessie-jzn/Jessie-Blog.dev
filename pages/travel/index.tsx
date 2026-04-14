import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';
import { NOTION_POST_ID } from '@/lib/constants';
import Image from 'next/image';
import SiteConfig from '@/site.config';
import * as Types from '@/lib/type';
import getLocalizedCategoryPosts from '@/lib/notion/getLocalizedCategoryPosts';
import { useState } from 'react';
import Link from 'next/link';
import TravelListLayout from '@/components/layouts/TravelListLayout';
import { useTranslation } from 'next-i18next';
import { CommonSEO } from '@/components/SEO';

export const getStaticProps: GetStaticProps = async ({ locale = 'zh' }) => {
  const { posts, tagOptions, translations } = await getLocalizedCategoryPosts({
    locale,
    pageId: NOTION_POST_ID,
    from: 'travel-index',
    categories: ['travel-en', 'travel-zh'],
    useCache: true,
  });

  return {
    props: {
      posts,
      tagOptions,
      ...translations,
    },
    revalidate: 10,
  };
};

const ease = [0.23, 1, 0.32, 1];

const TravelListPage = ({ posts, tagOptions }: any) => {
  const { t } = useTranslation('common');
  const [curTab, setCurTab] = useState('All');
  const [postList, setPostList] = useState(posts);

  const handleChangeTab = (item: Types.Tag) => {
    setCurTab(item.id);
    setPostList(item.articles);
  };

  const featured = postList[0];
  const grid = postList.slice(1);

  return (
    <>
      <CommonSEO
        title={t('travel.title', { ns: 'common' })}
        description={t('travel.description', { ns: 'common' })}
      />

      <div className='min-h-screen bg-white dark:bg-gray-950'>
        <h1 className='sr-only'>{t('travel.title')}</h1>

        {/* Hero */}
        <header className='relative w-full h-[55vh] xs:h-[40vh] overflow-hidden'>
          <Image
            src={`${SiteConfig.imageDomainUrl}/image6.jpg`}
            alt={t('travel.title')}
            fill
            priority
            className='object-cover object-[center_30%] scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70' />

          <div className='absolute inset-0 flex flex-col items-center justify-end pb-20 xs:pb-14 px-6'>
            <motion.div
              className='text-center'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
            >
              <h2 className='text-5xl xs:text-2xl font-light text-white tracking-[0.15em] uppercase'>
                {t('travel.title')}
              </h2>
              <div className='mx-auto mt-4 w-12 h-[1px] bg-white/60' />
              <p className='mt-4 text-sm xs:text-xs text-white/70 tracking-widest uppercase font-light'>
                {t('travel.description')}
              </p>
            </motion.div>
          </div>

          <div className='absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-gray-950 to-transparent' />
        </header>

        {/* Content */}
        <div className='max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 -mt-6 relative z-10'>
          {/* Tag Navigation */}
          <motion.nav
            className='flex items-center justify-center gap-6 xs:gap-4 py-6 border-b border-gray-100 dark:border-gray-800/50 overflow-x-auto scrollbar-hide'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              className={`relative text-sm xs:text-xs tracking-wide whitespace-nowrap transition-colors duration-300 pb-1
                ${
                  curTab === 'All'
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                }`}
              onClick={() =>
                handleChangeTab({
                  id: 'All',
                  articles: posts,
                  count: posts?.length,
                  value: t('travel.tabs.all'),
                })
              }
            >
              {t('travel.tabs.all')}
              {curTab === 'All' && (
                <motion.div
                  layoutId='tab-underline'
                  className='absolute -bottom-px left-0 right-0 h-[1.5px] bg-gray-900 dark:bg-white'
                />
              )}
            </button>

            {tagOptions?.map((tag: Types.Tag) => (
              <button
                key={tag.id}
                className={`relative text-sm xs:text-xs tracking-wide whitespace-nowrap transition-colors duration-300 pb-1
                  ${
                    curTab === tag.id
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                  }`}
                onClick={() => handleChangeTab(tag)}
              >
                {tag.name}
                {curTab === tag.id && (
                  <motion.div
                    layoutId='tab-underline'
                    className='absolute -bottom-px left-0 right-0 h-[1.5px] bg-gray-900 dark:bg-white'
                  />
                )}
              </button>
            ))}
          </motion.nav>

          {/* Featured Post */}
          {featured && (
            <motion.div
              className='mt-10 xs:mt-6'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href={`${featured?.category}/${featured?.slug || featured.id}`}
                className='group block'
              >
                <div className='relative rounded-2xl overflow-hidden aspect-[21/9] xs:aspect-[16/10]'>
                  <Image
                    src={featured.pageCover}
                    alt={featured.title}
                    fill
                    className='object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]'
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />

                  <div className='absolute bottom-0 left-0 right-0 p-8 xs:p-5'>
                    {featured.city?.length > 0 && (
                      <p className='text-xs text-white/60 tracking-widest uppercase mb-2'>
                        {featured.city.join(' · ')}
                      </p>
                    )}
                    <h3 className='text-2xl xs:text-lg font-light text-white leading-snug tracking-wide'>
                      {featured.title}
                    </h3>
                    <p className='mt-2 text-sm text-white/50 font-light line-clamp-1 max-w-2xl xs:hidden'>
                      {featured.summarize}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Post Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 mt-10 xs:mt-6 pb-20 xs:pb-12'>
            {grid.map((post: any, index: number) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.4 + index * 0.06, duration: 0.5, ease },
                }}
                className='group'
              >
                <Link href={`${post?.category}/${post?.slug || post.id}`}>
                  <div className='relative rounded-xl overflow-hidden aspect-[4/3]'>
                    <Image
                      src={post.pageCover}
                      alt={post.title}
                      fill
                      className='object-cover transition-transform duration-[1s] group-hover:scale-[1.04]'
                    />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500' />

                    <div className='absolute bottom-0 left-0 right-0 p-5 xs:p-4'>
                      {post.city?.length > 0 && (
                        <p className='text-[10px] text-white/50 tracking-[0.2em] uppercase mb-1.5'>
                          {post.city.join(' · ')}
                        </p>
                      )}
                      <h3 className='text-sm xs:text-xs font-light text-white leading-relaxed line-clamp-2 tracking-wide'>
                        {post.title}
                      </h3>
                    </div>
                  </div>

                  <div className='mt-3 flex items-center justify-between'>
                    <time className='text-[11px] text-gray-400 dark:text-gray-500 font-light tabular-nums tracking-wide'>
                      {post.lastEditedDate}
                    </time>
                    {post.sorts?.length > 0 && (
                      <span className='text-[11px] text-gray-400 dark:text-gray-500 font-light tracking-wide'>
                        {post.sorts[0]}
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

TravelListPage.getLayout = (page: React.ReactElement) => {
  return <TravelListLayout>{page}</TravelListLayout>;
};

export default TravelListPage;
