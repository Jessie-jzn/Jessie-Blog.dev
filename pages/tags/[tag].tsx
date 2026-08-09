/**
 * 标签动态页：从 Notion 文章库构建标签路由数据并展示该标签下的文章列表。
 */
import getDataBaseList from "@/lib/notion/getDataBaseList";
import ListLayoutWithTags from "@/components/layouts/ListLayoutWithTags";
import { GetStaticPaths } from "next";
import * as Types from "@/lib/type";
import { GetStaticProps } from "next";
import { NOTION_POST_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import {
  createTagPaths,
  resolveTagRouteData,
} from "@/lib/routing/tagRouteData";

export const getStaticProps: GetStaticProps = async ({ params, locale }) => {
  try {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "tags-index",
    });

    const routeData = resolveTagRouteData(response.tagOptions, params?.tag);

    return {
      props: {
        ...routeData,
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
      revalidate: 10,
    };
  } catch (error) {
    const routeData = resolveTagRouteData([], params?.tag);
    return {
      props: {
        ...routeData,
        ...(await serverSideTranslations(locale ?? "en", ["common"])),
      },
      revalidate: 10,
    };
  }
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "tags-index",
    });
    return {
      paths: createTagPaths(response.tagOptions),
      fallback: true,
    };
  } catch (error) {
    console.error("[tags/getStaticPaths] 无法获取标签列表:", error);
    return {
      paths: [],
      fallback: true,
    };
  }
};
export default function TagPage({
  tagOptions,
  posts,
  filteredTag,
}: {
  tagOptions: Types.Tag[];
  posts: Types.Post[];
  filteredTag: Types.Tag;
}) {
  const { t } = useTranslation("common");

  // const title = tagOptions[0].name.toUpperCase();
  return (
    <ListLayoutWithTags
      posts={posts}
      tagOptions={tagOptions}
      title={
        filteredTag?.name
          ? `${t("tags")}: ${filteredTag.name}`
          : t("tags")
      }
    />
  );
}
