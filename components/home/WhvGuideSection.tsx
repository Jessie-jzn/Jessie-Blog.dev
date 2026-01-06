import Link from 'next/link';
import Image from 'next/image';
import SectionHeader from '@/components/common/SectionHeader';
import * as Types from '@/lib/type';
const whvSteps = [
  {
    title: '行前准备',
    icon: '✈️',
    link: '/tag/preparation',
    desc: '签证/行李',
  },
  { title: '落地生存', icon: '🇦🇺', link: '/tag/landing', desc: '办卡/税号' },
  { title: '工作攻略', icon: '💼', link: '/tag/jobs', desc: '农场/肉厂' },
  { title: '离澳退税', icon: '💰', link: '/tag/tax', desc: 'Super/退税' },
];

const WhvGuideSection = ({ posts }: { posts: Types.Post[] }) => {
  return (
    <section className='py-4 container mx-auto px-4'>
      <SectionHeader
        title='WHV 打工度假指南'
        subtitle='最新工作资讯与生存干货'
        readMoreLink='/whv'
      />
      {/* 步骤导航 Icons */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        {whvSteps.map((step, i) => (
          <Link key={i} href={step.link} className='group'>
            <div className='bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 text-center hover:bg-[#62BFAD]/10 hover:shadow-md transition-all border border-transparent hover:border-[#62BFAD]/30'>
              <div className='text-3xl mb-3 transform group-hover:scale-110 transition-transform'>
                {step.icon}
              </div>
              <h3 className='font-bold text-gray-900 dark:text-white mb-1'>
                {step.title}
              </h3>
              <div className='text-xs text-gray-500'>{step.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className='group h-full'
          >
            <div className='flex flex-col h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800'>
              <div className='relative h-48 overflow-hidden'>
                <Image
                  src={post.pageCoverThumbnail}
                  alt={post.title}
                  fill
                  className='object-cover group-hover:scale-105 transition-transform duration-500'
                />
                <div className='absolute top-3 left-3'>
                  <span className='px-2 py-1 bg-black/60 backdrop-blur-md text-white text-xs rounded-md font-medium'>
                    {post.tags?.[0] || '干货'}
                  </span>
                </div>
              </div>
              <div className='p-5 flex-1 flex flex-col'>
                <h3 className='text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#62BFAD] transition-colors'>
                  {post.title}
                </h3>
                <div className='text-sm text-gray-500 line-clamp-2 mb-4 flex-1'>
                  {post.summarize}
                </div>
                <div className='flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-gray-100 dark:border-gray-800'>
                  <span>📅 {post.lastEditedDate}</span>
                  <span className='text-[#62BFAD] font-medium'>阅读全文 →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WhvGuideSection;
