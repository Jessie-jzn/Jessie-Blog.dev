/** 在 Notion 文章侧栏将相关 Notion 文章数据转换为编辑式卡片列表。 */
import React, { useMemo } from "react";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";
import * as Types from "@/lib/type";

interface NotionPageAsideProps {
  relatedPosts?: Types.Post[];
}

const NotionPageAside: React.FC<NotionPageAsideProps> = ({
  relatedPosts = [],
}) => {
  const renderedPosts = useMemo(
    () => (
      <ul className="space-y-4">
        {relatedPosts.map((post) => {
          return (
            <li key={post.id}>
              <EditorialArticleCard article={post} variant="compact" />
            </li>
          );
        })}
      </ul>
    ),
    [relatedPosts],
  );

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <aside className="mt-12 w-full">
      <div className="editorial-surface rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
          相关推荐
        </h2>
        {renderedPosts}
      </div>
    </aside>
  );
};

export default React.memo(NotionPageAside);
