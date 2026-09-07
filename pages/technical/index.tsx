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
import { CommonSEO } from "@/components/SEO";
import { useTranslation } from "next-i18next";
import PageHeader from "@/components/common/PageHeader";
import FilterPills from "@/components/common/FilterPills";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";
import {
  filterCategoryPosts,
  toCategoryPageData,
} from "@/lib/routing/categoryPageData";
import type { PostListItem, TagSummary } from "@/lib/routing/listPageData";

const Sidebar = dynamic(() => import("@/components/Sidebar"), {
  ssr: false,
});

const ArticleList = React.memo(({ articles }: { articles: PostListItem[] }) => {
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
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { posts, tagOptions, translations } = await getLocalizedCategoryPosts({
    locale,
    pageId: NOTION_POST_ID,
    from: "technical-index",
    categories: ["technical-en", "technical-zh"],
    useCache: true,
  });

  const pageData = toCategoryPageData(posts, tagOptions);

  return {
    props: {
      ...pageData,
      ...translations,
    },
    revalidate: 300,
  };
};

const PostListPage = ({
  posts,
  tagOptions,
}: {
  posts: PostListItem[];
  tagOptions: TagSummary[];
}) => {
  const { t } = useTranslation("common");
  const filterItems = useMemo<CategoryItem[]>(() => {
    return [
      {
        id: "all",
        name: t("all"),
      },
      ...tagOptions.map((tag) => ({
        id: tag.value || tag.name,
        name: tag.name || tag.value,
      })),
    ];
  }, [tagOptions, t]);

  const [activeFilterId, setActiveFilterId] = useState("all");
  const filteredPosts = useMemo(
    () => filterCategoryPosts(posts, activeFilterId),
    [activeFilterId, posts],
  );

  const handleChangeCategory = (item: CategoryItem) => {
    setActiveFilterId(item.id);
  };

  return (
    <>
      <CommonSEO
        title={t("technical.title", { ns: "common" })}
        description={t("technical.description", { ns: "common" })}
        keywords={t("seo.technicalKeywords")}
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
            items={filterItems}
            activeId={activeFilterId}
            onChange={handleChangeCategory}
            ariaLabel={t("nav.technical")}
          />
        </div>

        <div className="w-full px-4 pb-16 pt-8 sm:px-6 md:pb-24 lg:px-8">
          <div className="flex flex-col gap-8 md:flex-row">
            <div className="min-h-screen min-w-0 flex-1">
              <ArticleList articles={filteredPosts} />
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
