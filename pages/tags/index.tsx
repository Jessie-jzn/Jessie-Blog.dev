/**
 * 标签索引页：从 Notion 文章库读取标签统计并按数量排序展示。
 */
import Link from "@/components/Link";
import { GetStaticProps } from "next";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import * as Types from "@/lib/type";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import PageHeader from "@/components/common/PageHeader";

interface TagOptions {
  tagOptions: Types.Tag[];
}
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "tags-index",
  });

  return {
    props: {
      tagOptions: response.tagOptions,
      ...(await serverSideTranslations(locale ?? "en", ["common"])),
    },
    revalidate: 10,
  };
};

const TagsIndex = ({ tagOptions }: TagOptions) => {
  const { t } = useTranslation("common");
  const sortedTags = [...tagOptions].sort((a, b) => a.count - b.count);

  return (
    <div className="min-h-[60vh] bg-canvas text-ink">
      <PageHeader
        eyebrow={t("post")}
        title={t("tags")}
        meta={`${tagOptions.length} ${t("tags")}`}
      />

      <main className="site-container pb-16 md:pb-24">
        {sortedTags.length ? (
          <ul className="flex flex-wrap gap-3" aria-label={t("tags")}>
            {sortedTags.map((tag: Types.Tag) => (
              <li key={tag.id}>
                <Link
                  href={`/tags/${encodeURIComponent(tag.id)}`}
                  className="editorial-focus editorial-filter inline-flex min-h-10 items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:border-primary hover:bg-primarySoft hover:text-primaryStrong"
                >
                  <span>{tag.name || tag.id}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-subtle">
                    {tag.count}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div
            className="editorial-surface rounded-2xl p-6 text-sm text-subtle"
            role="status"
          >
            No tags found.
          </div>
        )}
      </main>
    </div>
  );
};
export default TagsIndex;
