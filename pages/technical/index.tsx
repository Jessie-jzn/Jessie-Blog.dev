import { GetStaticProps } from "next";
import React, { memo, useState, useCallback, useMemo } from "react";
import { NOTION_POST_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { motion, AnimatePresence } from "framer-motion";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CardChapterList from "@/components/CustomLayout/CardChapterList";
import PostListLayout from "@/components/layouts/PostListLayout";
import dynamic from "next/dynamic";
import * as Types from "@/lib/type";

// Dynamically import sidebar component
const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
});

// 分类标签组件
const CategoryTab = React.memo(
  ({
    category,
    isActive,
    onClick,
  }: {
    category: Types.Tag | { id: string; name: string };
    isActive: boolean;
    onClick: () => void;
  }) => {
    const tabItemVariants = {
      initial: { opacity: 1, y: 0 },
      hover: { scale: 1.1, color: "#62BFAD" },
      active: { scale: 1.2, color: "#62BFAD" },
    };

    return (
      <motion.div
        onClick={onClick}
        variants={tabItemVariants}
        animate={isActive ? "active" : "initial"}
        whileHover="hover"
        className="whitespace-nowrap text-sm font-medium transition-colors cursor-pointer mx-2"
      >
        {category.name}
      </motion.div>
    );
  }
);

CategoryTab.displayName = "CategoryTab";
// 文章列表组件
const ArticleList = React.memo(({ articles }: { articles: Types.Post[] }) => {
  return (
    <div className="space-y-4">
      {articles.map((article: any, index: number) => (
        <CardChapterList
          article={article}
          index={index}
          key={article.id}
          category="technical"
        />
      ))}
    </div>
  );
});

ArticleList.displayName = "ArticleList";

// Update the type definition for allTagArticles
type CategoryItem = {
  id: string;
  name: string;
  articles: Types.Post[];
};

// 主页面组件
const PostListPage = ({ tagOptions }: { tagOptions: Types.Tag[] }) => {
  const allTagArticles = useMemo<CategoryItem[]>(
    () => [
      {
        id: "all",
        name: "全部",
        articles: tagOptions.flatMap((option) => option.articles || []),
      },
      ...tagOptions.map((tag) => ({
        id: tag.id,
        name: tag.name || "",
        articles: tag.articles || [],
      })),
    ],
    [tagOptions]
  );

  const [curCategoryItem, setCurCategoryItem] = useState<CategoryItem>(
    allTagArticles[0]
  );

  const handleChangeCategory = (item: CategoryItem) => {
    setCurCategoryItem(item);
  };

  return (
    <div className="bg-white dark:bg-gray-900/70 flex items-center flex-col">
      {/* 分类导航栏 */}
      <nav className="max-w-screen-xl xs:max-w-full w-full sticky top-[52px] z-40 bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 overflow-x-auto px-4 py-3 no-scrollbar">
              <AnimatePresence>
                {allTagArticles.map((category: CategoryItem) => (
                  <CategoryTab
                    key={category.id}
                    category={category}
                    isActive={curCategoryItem.id === category.id}
                    onClick={() => handleChangeCategory(category)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="max-w-screen-xl mx-auto px-4 xs:px-2 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 文章列表 */}
          <motion.div
            className="flex-1 min-h-screen pt-4 md:pt-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ArticleList articles={curCategoryItem.articles} />
          </motion.div>

          {/* 右侧边栏 */}
          <aside className="hidden md:block w-80 pt-8">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
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

PostListPage.getLayout = (page: React.ReactElement) => {
  return <PostListLayout>{page}</PostListLayout>;
};

export default PostListPage;
