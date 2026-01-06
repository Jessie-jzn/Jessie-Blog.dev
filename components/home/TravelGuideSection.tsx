import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/common/SectionHeader';
import { useTranslation } from 'next-i18next';

const TravelGuideSection = ({ posts }: { posts: any[] }) => {
  const { t } = useTranslation('home');

  return (
    <section className='py-16 bg-gray-50 dark:bg-gray-900/50'>
      <div className='container mx-auto px-4'>
        <SectionHeader
          title={t('travelGuide.title')}
          subtitle={t('travelGuide.subtitle')}
          readMoreLink='/travel'
        />

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6'>
          {/* 大图主推 */}
          <div className='lg:col-span-7'>
            {posts[0] && (
              <Link
                href={`/post/${posts[0].id}`}
                className='group relative block h-[400px] lg:h-[500px] rounded-2xl overflow-hidden shadow-lg'
              >
                <Image
                  src={posts[0].pageCoverThumbnail}
                  alt={posts[0].title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-700'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent' />
                <div className='absolute bottom-0 p-8 w-full'>
                  <span className='inline-block px-3 py-1 mb-3 bg-[#62BFAD] text-white text-xs font-bold rounded-full'>
                    MUST GO
                  </span>
                  <h3 className='text-2xl md:text-3xl font-bold text-white mb-2 leading-tight group-hover:text-[#62BFAD] transition-colors'>
                    {posts[0].title}
                  </h3>
                  <div className='text-gray-200 line-clamp-2 text-sm md:text-base'>
                    {posts[0].summarize}
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* 右侧列表 */}
          <div className='lg:col-span-5 flex flex-col gap-4'>
            {posts.slice(1, 5).map((post) => (
              <Link
                key={post.id}
                href={`/post/${post.id}`}
                className='group flex gap-4 items-center bg-white dark:bg-gray-900 p-3 rounded-xl shadow-sm hover:shadow-md transition-all'
              >
                <div className='relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0'>
                  <Image
                    src={post.pageCoverThumbnail}
                    alt={post.title}
                    fill
                    className='object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                </div>
                <div>
                  <h4 className='font-bold text-gray-900 dark:text-gray-100 leading-snug mb-2 group-hover:text-[#62BFAD] transition-colors line-clamp-2'>
                    {post.title}
                  </h4>
                  <div className='text-xs text-gray-500 flex items-center gap-1'>
                    <span>📍 旅行攻略</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TravelGuideSection;
