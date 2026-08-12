/** 渲染作者资料、站点统计和 Mailchimp 订阅入口的侧栏。 */
import React from 'react';
import Image from 'next/image';
import SiteConfig from '@/site.config';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';

const Sidebar = () => {
  return (
    <div className='editorial-surface rounded-2xl'>
      <div className='flex flex-col items-center p-6 text-center'>
        <div className='relative w-20 h-20 mx-auto'>
          <Image
            src='/images/avatar.png'
            alt='Author avatar'
            fill
            className='rounded-full object-cover'
          />
        </div>
        <h2 className='mt-3 text-lg font-semibold text-ink'>{SiteConfig.author}</h2>
        <p className='mt-2 line-clamp-2 text-sm leading-6 text-subtle'>
          {SiteConfig.summary}
        </p>

        {/* 统计信息 */}
        <div className='my-5 grid w-full grid-cols-3 gap-3 border-y border-line py-4'>
          <div className='text-center'>
            <div className='text-lg font-semibold text-ink'>120</div>
            <div className='text-xs text-subtle'>文章</div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-semibold text-ink'>1.2k</div>
            <div className='text-xs text-subtle'>访问</div>
          </div>
          <div className='text-center'>
            <div className='text-lg font-semibold text-ink'>89</div>
            <div className='text-xs text-subtle'>订阅</div>
          </div>
        </div>
        {/* <SocialContactIcon /> */}
        <div className='w-full'>
          <NewsletterSubscribe />
        </div>
      </div>
    </div>
  );
};

export default React.memo(Sidebar);
