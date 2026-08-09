/**
 * 技术分类页：从 Notion 获取本地化技术文章，并提供客户端标签筛选与侧栏。
 */
import { GetStaticProps } from "next";
import React, { useMemo, useState } from "react";
import { NOTION_POST_ID } from "@/lib/constants";
import { motion, AnimatePresence } from "framer-motion";
import getLocalizedCategoryPosts from "@/lib/notion/getLocalizedCategoryPosts";
import PostListLayout from "@/components/layouts/PostListLayout";
import dynamic from "next/dynamic";
import * as Types from "@/lib/type";
import { CommonSEO } from "@/components/SEO";
import { useTranslation } from "next-i18next";
import PageHeader from "@/components/common/PageHeader";
import FilterPills from "@/components/common/FilterPills";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
});

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
        {articles.map((article, index) => (
          <EditorialArticleCard
            article={article}
            key={article.id}
            variant="compact"
            priority={index === 0}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
});

ArticleList.displayName = "ArticleList";

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
        name: t("all"),
        articles: posts,
      },
      ...tagOptions.map((tag) => ({
        id: tag.id,
        name: tag.name || "",
        articles: tag.articles || [],
      })),
    ];
  }, [posts, tagOptions, t]);

  const [curCategoryItem, setCurCategoryItem] = useState<CategoryItem>(
    allTagArticles[0],
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
      <div className="min-h-[60vh] bg-canvas text-ink">
        <PageHeader
          eyebrow={t("lastPost")}
          title={t("nav.technical")}
          description={t("technical.description", {
            defaultValue: t("site.description"),
          })}
        />

        <div className="sticky top-14 z-40 border-y border-line bg-canvas/90 px-4 py-3 backdrop-blur-xl sm:top-16 sm:px-6 lg:px-8">
          <FilterPills
            items={allTagArticles}
            activeId={curCategoryItem.id}
            onChange={handleChangeCategory}
            ariaLabel={t("nav.technical")}
          />
        </div>

        <div className="w-full px-4 pb-16 pt-8 sm:px-6 md:pb-24 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="min-h-screen min-w-0 flex-1">
              <ArticleList articles={curCategoryItem.articles} />
            </div>

            <aside className="hidden w-80 shrink-0 md:block">
              <div className="sticky top-36">
                <Sidebar />
              </div>
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
