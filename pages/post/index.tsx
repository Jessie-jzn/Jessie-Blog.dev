/**
 * 文章聚合页：从 Notion 文章数据库读取已发布文章，并提供搜索与标签导航。
 */
import type { GetStaticProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import ListLayoutWithTags from "@/components/layouts/ListLayoutWithTags";
import { NOTION_POST_ID } from "@/lib/constants";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import {
  toPostListItems,
  toTagSummaries,
  type PostListItem,
  type TagSummary,
} from "@/lib/routing/listPageData";
import { CommonSEO } from "@/components/SEO";

interface ArticleIndexProps {
  posts: PostListItem[];
  tagOptions: TagSummary[];
}

export const getStaticProps: GetStaticProps<ArticleIndexProps> = async ({
  locale,
}) => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "post-index",
  });

  return {
    props: {
      posts: toPostListItems(response.allPages),
      tagOptions: toTagSummaries(response.tagOptions),
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 300,
  };
};

const ArticleIndex = ({ posts, tagOptions }: ArticleIndexProps) => {
  const { t } = useTranslation("common");

  return (
    <>
      <CommonSEO
        title={t("articleList.all")}
        description={t("seo.articlesDescription")}
        keywords={t("seo.articlesKeywords")}
      />
      <ListLayoutWithTags
      posts={posts}
      tagOptions={tagOptions}
      title={t("articleList.all")}
      />
    </>
  );
};

export default ArticleIndex;
