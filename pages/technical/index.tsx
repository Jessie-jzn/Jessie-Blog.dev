import { GetStaticProps } from "next";
import React, { useState, useMemo } from "react";
import { NOTION_POST_ID } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import CardChapterList from "@/components/CustomLayout/CardChapterList";
import getLocalizedCategoryPosts from "@/lib/notion/getLocalizedCategoryPosts";
import PostListLayout from "@/components/layouts/PostListLayout";
import dynamic from "next/dynamic";
import * as Types from "@/lib/type";
import { CommonSEO } from "@/components/SEO";
import { useTranslation } from "next-i18next";
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
          transition-colors cursor-pointer py-1 px-0.5
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
        className="flex flex-col gap-4 sm:gap-5"
      >
        {articles.map((article: any) => (
          <CardChapterList article={article} key={article.id} />
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

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { posts, tagOptions, translations } = await getLocalizedCategoryPosts({
    locale,
    pageId: NOTION_POST_ID,
    from: "technical-index",
    categories: ["technical-en", "technical-zh"],
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

// 主页面组件
const PostListPage = ({
  posts,
  tagOptions,
}: {
  posts: Types.Post[];
  tagOptions: Types.Tag[];
}) => {
  const { t } = useTranslation("common");
  const allTagArticles = useMemo<CategoryItem[]>(() => {
    return [
      {
        id: "all",
        name: "全部",
        articles: posts,
      },
      ...tagOptions.map((tag) => ({
        id: tag.id,
        name: tag.name || "",
        articles: tag.articles || [],
      })),
    ];
  }, [posts, tagOptions]);

  const [curCategoryItem, setCurCategoryItem] = useState<CategoryItem>(
    allTagArticles[0]
  );

  const handleChangeCategory = (item: CategoryItem) => {
    setCurCategoryItem(item);
  };

  return (
    <>
      <CommonSEO
        title={t("technical.title", { ns: "common" })}
        description={t("travel.description", { ns: "common" })}
      />
      <div className="flex items-center flex-col min-h-[60vh]">
        {/* 分类导航 */}
        <nav className="w-full sticky top-[52px] z-40 bg-white/80 dark:bg-neutral-950/82 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.08]">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-3 sm:gap-x-6 overflow-x-auto px-3 sm:px-1 py-2.5 sm:py-3 no-scrollbar">
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
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4">
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
    </>
  );
};

PostListPage.getLayout = (page: React.ReactElement) => {
  return <PostListLayout>{page}</PostListLayout>;
};

export default PostListPage;
