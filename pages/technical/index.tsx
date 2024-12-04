import { GetStaticProps } from "next";
import React, { useState, useEffect } from "react";
import { NOTION_POST_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { motion } from "framer-motion";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import SiteConfig from "@/site.config";
import SocialIcon from "@/components/SocialIcon";
import CardChapterList from "@/components/CustomLayout/CardChapterList";
import PostListLayout from '@/components/layouts/PostListLayout';

import * as Types from "@/lib/type";

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  // 根据语言选择不同的 Notion ID
  const notionPostId = locale === "en" ? NOTION_POST_EN_ID : NOTION_POST_ID;
  const response = await getDataBaseList({
    pageId: notionPostId,
    from: "post-index",
  });

  return {
    props: {
      posts: response.allPages,
      tagOptions: response.tagOptions,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};

const PostListPage = ({ tagOptions }: any) => {
  const [isFixed, setIsFixed] = useState(false);
  const [curCategoryItems,setCurCategoryItems] = useState(tagOptions?.[0]);

  console.log('tagOptions',tagOptions)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsFixed(scrollTop > 812);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * 
   */
  const handleChangeCategory = (items:Types.Tag) => {
    setCurCategoryItems(items)
  }
  const tabItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1, color: "#bec088" },
    active: { scale: 1.2, color: "#bec088" },
  };

  return (
    <div className="bg-white dark:bg-gray-900/70">
      {/* 桌面端 Banner，移动端隐藏 */}
      {/* <motion.header
        className="relative w-full h-[700px] bg-cover bg-center p-8 hidden md:block"
        style={{ backgroundImage: `url('https://www.dropbox.com/scl/fi/08hi5tej7hcq4748tl1ue/image7.png?rlkey=3cq2rcf69x70ex3whbekp5hoz&st=wl8eotyx&raw=1')` }}
      >
        <div className="flex flex-col justify-center ml-12">
        <motion.h2
            className="text-7xl xs:text-3xl font-extrabold text-white leading-tight mb-6 shadow-lg"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            Unlocking the Future of Technology
          </motion.h2>
          <p className="text-lg xs:text-sm text-white leading-tight mb-4">
            Join us as we explore the latest trends, tools, and techniques in the tech world. 
            Dive deep into insightful discussions and share your knowledge with a community of innovators.
          </p>
        </div>
      </motion.header>
       */}

      {/* <nav
        className={`p-4 w-48 rounded-lg xs:hidden ${
          isFixed ? "fixed top-20" : "absolute top-[812px] left-0"
        }`}
      >
        <div className="pb-2 text-center flex justify-b border-b-stone-300 border-b-2">
          <Image
            src='http://jessieontheroad.com/avatar.png'
            alt="Your Name"
            width={50}
            height={50}
            quality={75} // 设置压缩质量，默认为75
            loading="lazy"
            
            className="rounded-full mb-2 object-cover"
          />
          <div className="flex flex-col ml-2">
            <h3 className="text-lg font-semibold text-gray-800">
              {SiteConfig.author}
            </h3>
            <div className="flex space-x-2 mt-2">
              <SocialIcon
                kind="mail"
                href={`mailto:${SiteConfig.email}`}
                size={5}
                theme="dark"
              />
              <SocialIcon
                kind="github"
                href={SiteConfig.github}
                size={5}
                theme="dark"
              />
              <SocialIcon
                kind="facebook"
                href={SiteConfig.facebook}
                size={5}
                theme="dark"
              />
              <SocialIcon
                kind="linkedin"
                href={SiteConfig.linkedin}
                size={5}
                theme="dark"
              />
            </div>
          </div>
        </div>
        <ul className="space-y-4 pt-2">
          {tagOptions.map((chapter: Types.Tag, index: number) => (
            <li key={index}>
              <a
                href={`#chapter-${index}`}
                className="hover:text-blue-300 text-gray-600"
              >
                {chapter.name}
              </a>
            </li>
          ))}
        </ul>
      </nav> */}

      {/* <div className="sticky top-[52px] z-40 bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="flex space-x-4 px-4 py-3 overflow-x-auto">
          <button className="text-blue-500 font-medium">推荐</button>
          <button className="text-gray-600 hover:text-gray-900">最新</button>
          <button className="text-gray-600 hover:text-gray-900">热门</button>
        </div>
      </div> */}

      {/* 分类导航栏 */}
      <nav className="w-full sticky top-[52px] z-40 bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-6 overflow-x-auto py-3 no-scrollbar">
              {tagOptions.map((category: Types.Tag) => (
                <motion.div
                  key={category.id}
                  onClick={()=>handleChangeCategory(category)}
                  variants={tabItemVariants}
                  animate={curCategoryItems.id === category.id ? "active" : "initial"}
                  className={`whitespace-nowrap text-sm font-medium transition-colors cursor-pointer`}
                  
                >
                  {category.name}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 xs:px-0">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 左侧文章列表 */}
          <motion.div
            className="flex-1 min-h-screen pt-4 md:pt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4">
              {curCategoryItems?.articles.map((article: any, index: number) => (
                <CardChapterList
                  article={article}
                  index={index}
                  key={article.id}
                  category="technical"
                />
              ))}
            </div>
          </motion.div>

          {/* 右侧边栏 - 仅在桌面端显示 */}
          <aside className="hidden md:block w-80 pt-8">
            <div className="sticky top-[120px] bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex items-center space-x-4 mb-6">
                <Image
                  src={SiteConfig.siteLogo}
                  alt={SiteConfig.author}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div>
                  <h3 className="font-semibold">{SiteConfig.author}</h3>
                  <p className="text-sm text-gray-500">{SiteConfig.summary}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4">
                <SocialIcon kind="github" href={SiteConfig.github} size={6} />
                <SocialIcon kind="twitter" href={SiteConfig.twitter} size={6} />
                <SocialIcon kind="linkedin" href={SiteConfig.linkedin} size={6} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

PostListPage.getLayout = (page: React.ReactElement) => {
  return <PostListLayout>{page}</PostListLayout>;
};

export default PostListPage; 