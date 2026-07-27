import { GetStaticProps } from 'next';
import { motion } from 'framer-motion';
import { NOTION_POST_ID } from '@/lib/constants';
import Image from 'next/image';
import ArticleImage from '@/components/ArticleImage';
import SiteConfig from '@/site.config';
import * as Types from '@/lib/type';
import getLocalizedCategoryPosts from '@/lib/notion/getLocalizedCategoryPosts';
import { useState } from 'react';
import Link from 'next/link';
import TravelListLayout from '@/components/layouts/TravelListLayout';
import { useTranslation } from 'next-i18next';
import { CommonSEO } from '@/components/SEO';
import { canonicalArticlePath } from '@/lib/routing/articleRoute';
import PageHeader from '@/components/common/PageHeader';
import FilterPills from '@/components/common/FilterPills';
import EditorialArticleCard from '@/components/articles/EditorialArticleCard';

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
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

type TravelFilter = {
  id: string;
  name: string;
  articles: Types.Post[];
};

const TravelListPage = ({ posts, tagOptions }: any) => {
  const { t } = useTranslation('common');
  const [curTab, setCurTab] = useState('All');
  const [postList, setPostList] = useState(posts);

  const filters: TravelFilter[] = [
    {
      id: 'All',
      name: t('travel.tabs.all'),
      articles: posts,
    },
    ...(tagOptions || []).map((tag: Types.Tag) => ({
      id: tag.id,
      name: tag.name || tag.value || '',
      articles: tag.articles || [],
    })),
  ];

  const handleChangeTab = (item: TravelFilter) => {
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

      <div className='min-h-screen bg-canvas text-ink'>
        {/* Hero */}
        <section className='relative min-h-[32rem] w-full overflow-hidden sm:min-h-[36rem]'>
          <Image
            src={`${SiteConfig.imageDomainUrl}/image6.jpg`}
            alt={t('travel.title')}
            fill
            priority
            className='object-cover object-[center_30%] scale-105'
          />
          <div className='absolute inset-0 bg-gradient-to-b from-black/20 via-black/35 to-black/75' />

          <div className='absolute inset-0 flex items-end'>
            <motion.div
              className='w-full [&_h1]:text-white [&_p]:text-white/85 [&_.editorial-tag]:border-white/25 [&_.editorial-tag]:bg-white/15 [&_.editorial-tag]:text-white'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease }}
            >
              <PageHeader
                align='center'
                eyebrow={t('nav.travel')}
                title={t('travel.title')}
                description={t('travel.description')}
              />
            </motion.div>
          </div>
        </section>

        {/* Content */}
        <div className='site-container'>
          {/* Tag Navigation */}
          <motion.div
            className='border-b border-line py-6'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <FilterPills
              items={filters}
              activeId={curTab}
              onChange={handleChangeTab}
              ariaLabel={t('travel.categories.title')}
            />
          </motion.div>

          {/* Featured Post */}
          {featured && (
            <motion.div
              className='mt-10'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease }}
            >
              <Link
                href={canonicalArticlePath(featured)}
                prefetch={false}
                className='group block'
              >
                <article className='relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-muted sm:aspect-[21/9]'>
                  <ArticleImage
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
                </article>
              </Link>
            </motion.div>
          )}

          {/* Post Grid */}
          <div className='mt-10 grid grid-cols-1 gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3'>
            {grid.map((post: any, index: number) => {
              const article = {
                ...post,
                tags: [
                  ...(post.city || []),
                  ...(post.sorts || []),
                  ...(post.tags || []),
                ],
              } as Types.Post;

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: { delay: 0.4 + index * 0.06, duration: 0.5, ease },
                  }}
                >
                  <EditorialArticleCard
                    article={article}
                    variant='feature'
                    priority={index === 0}
                  />
                </motion.div>
              );
            })}
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
