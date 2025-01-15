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
      hover: { scale: 1.05, color: "#62BFAD" },
      active: { scale: 1.1, color: "#62BFAD" },
    };

    return (
      <motion.div
        onClick={onClick}
        variants={tabItemVariants}
        animate={isActive ? "active" : "initial"}
        whileHover="hover"
        className={`
          whitespace-nowrap text-xs sm:text-sm font-medium 
          transition-colors cursor-pointer mx-1 sm:mx-2
          ${isActive ? "text-[#62BFAD]" : "text-gray-600 dark:text-gray-300"}
        `}
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
    <AnimatePresence mode="wait">
      <motion.div
        key={articles.length}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        {articles.map((article: any, index: number) => (
          <CardChapterList
            article={article}
            index={index}
            key={article.id}
            category="technical"
          />
        ))}
      </motion.div>
    </AnimatePresence>
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
  const allTagArticles = useMemo<CategoryItem[]>(() => {
    // 收集所有文章并去重
    const allArticlesMap = new Map();
    tagOptions.forEach((tag) => {
      (tag.articles || []).forEach((article) => {
        allArticlesMap.set(article.id, article);
      });
    });

    return [
      {
        id: "all",
        name: "全部",
        articles: Array.from(allArticlesMap.values()),
      },
      ...tagOptions.map((tag) => ({
        id: tag.id,
        name: tag.name || "",
        articles: tag.articles || [],
      })),
    ];
  }, [tagOptions]);

  const [curCategoryItem, setCurCategoryItem] = useState<CategoryItem>(
    allTagArticles[0]
  );

  const handleChangeCategory = (item: CategoryItem) => {
    setCurCategoryItem(item);
  };

  return (
    <div className="bg-white dark:bg-gray-900/70 flex items-center flex-col min-h-screen">
      {/* 分类导航栏 - 优化移动端显示 */}
      <nav className="w-full sticky top-[52px] z-40 bg-white dark:bg-gray-900/70 border-b border-gray-200 dark:border-gray-800">
        <div className="mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 sm:space-x-6 overflow-x-auto px-2 sm:px-4 py-2 sm:py-3 no-scrollbar">
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

      {/* 主要内容区域 - 优化间距和布局 */}
      <div className="w-full max-w-screen-xl mx-auto px-2 sm:px-4">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          {/* 文章列表 */}
          <div className="flex-1 min-h-screen pt-2 sm:pt-4 md:pt-8">
            <ArticleList articles={curCategoryItem.articles} />
          </div>

          {/* 右侧边栏 - 保持在大屏幕显示 */}
          <aside className="hidden md:block w-80 pt-8 sticky top-[120px]">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 获取中文文章
  const zhResponse = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "post-index",
  });

  // 获取英文文章
  const enResponse = await getDataBaseList({
    pageId: NOTION_POST_EN_ID,
    from: "post-index",
  });

  // 根据当前语言决定显示顺序
  const primaryPosts =
    locale === "en" ? enResponse.allPages : zhResponse.allPages;
  const secondaryPosts =
    locale === "en" ? zhResponse.allPages : enResponse.allPages;

  // 合并文章列表
  const allPosts = [...(primaryPosts || []), ...(secondaryPosts || [])];

  // 合并标签选项和其对应的文章
  const tagMap = new Map();

  // 处理中文标签和文章
  (zhResponse.tagOptions || []).forEach((tag) => {
    tagMap.set(tag.id, {
      id: tag.id,
      name: tag.name,
      articles: tag.articles || [],
    });
  });

  // 合并英文标签和文章
  (enResponse.tagOptions || []).forEach((tag) => {
    if (tagMap.has(tag.id)) {
      // 如果标签已存在，合并文章并去重
      const existingTag = tagMap.get(tag.id);
      const newArticles = tag.articles || [];

      // 使用 Map 去重，以文章 ID 为键
      const articlesMap = new Map();

      // 先添加已有的文章
      existingTag.articles.forEach((article: { id: any }) => {
        articlesMap.set(article.id, article);
      });

      // 添加新文章，如果 ID 已存在会自动覆盖
      newArticles.forEach((article) => {
        articlesMap.set(article.id, article);
      });

      // 更新文章列表
      existingTag.articles = Array.from(articlesMap.values());
    } else {
      // 如果是新标签，直接添加
      tagMap.set(tag.id, {
        id: tag.id,
        name: tag.name,
        articles: tag.articles || [],
      });
    }
  });

  // 转换回数组形式
  const uniqueTagOptions = Array.from(tagMap.values());

  return {
    props: {
      posts: allPosts,
      tagOptions: uniqueTagOptions,
      ...(await serverSideTranslations(locale || "zh", ["common"])),
    },
    revalidate: 10,
  };
};

PostListPage.getLayout = (page: React.ReactElement) => {
  return <PostListLayout>{page}</PostListLayout>;
};

export default PostListPage;
