import { GetStaticProps } from 'next';
import React, { useState, useEffect } from 'react';
import { NOTION_POST_ID } from '@/lib/constants';
import getDataBaseList from '@/lib/notion/getDataBaseList';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import SiteConfig from '@/site.config';
import SocialIcon from '@/components/SocialIcon';
import CardChapterList from '@/components/CustomLayout/CardChapterList';
import * as Types from '@/lib/type';

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: 'post-index',
  });

  return {
    props: {
      posts: response.allPages,
      tagOptions: response.tagOptions,
      ...(await serverSideTranslations(locale, ['common'])),
    },
    revalidate: 10,
  };
};

const Post = ({ tagOptions }: any) => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 812);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <motion.header
        className='relative w-full h-[700px] bg-cover bg-center p-8 xs:h-[300px] pt-[190px]'
        style={{ backgroundImage: `url('/images/image7.jpg')` }}
      >
        <div className='flex flex-col justify-center ml-12'>
          <motion.h2
            className='text-6xl xs:text-2xl font-extrabold text-white leading-tight mb-6'
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 50 }}
          >
            It all begins with an idea
          </motion.h2>
        </div>
      </motion.header>

      <nav
        className={`p-4 w-48 bg-yellow-50 rounded-lg xs:hidden ${
          isFixed ? 'fixed top-20' : 'absolute top-[812px] left-0'
        }`}
      >
        <div className='pb-2 text-center flex justify-b border-b-stone-300 border-b-2'>
          <Image
            src='/images/avatar.png'
            alt='Your Name'
            width={50}
            height={50}
            className='rounded-full mb-2 object-cover'
          />
          <div className='flex flex-col ml-2'>
            <h3 className='text-lg font-semibold text-gray-800'>
              {SiteConfig.author}
            </h3>
            <div className='flex space-x-2 mt-2'>
              <SocialIcon
                kind='mail'
                href={`mailto:${SiteConfig.email}`}
                size={5}
                theme='dark'
              />
              <SocialIcon
                kind='github'
                href={SiteConfig.github}
                size={5}
                theme='dark'
              />
              <SocialIcon
                kind='facebook'
                href={SiteConfig.facebook}
                size={5}
                theme='dark'
              />
              <SocialIcon
                kind='linkedin'
                href={SiteConfig.linkedin}
                size={5}
                theme='dark'
              />
            </div>
          </div>
        </div>
        <ul className='space-y-4 pt-2'>
          {tagOptions.map((chapter: Types.Tag, index: number) => (
            <li key={index}>
              <a
                href={`#chapter-${index}`}
                className='hover:text-blue-300 text-gray-600'
              >
                {chapter.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <motion.div
        className='bg-[#bec088] min-h-screen p-8 pt-28 pb-40 mx-auto ml-48 xs:ml-0'
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='space-y-4'>
          {tagOptions.map((chapter: Types.Tag, index: number) => (
            <CardChapterList chapter={chapter} index={index} key={chapter.id} />
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default Post;
