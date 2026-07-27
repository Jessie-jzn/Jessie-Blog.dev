import React from "react";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";
import type { Post } from "@/lib/type";

interface RelatedPost {
  id: string;
  title: string;
  tags: string[];
  category: string;
  slug?: string;
  summarize?: string;
  publishDay?: string;
  lastEditedDate?: string;
  pageCover?: string;
  pageCoverThumbnail?: string;
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  return (
    <aside className="hidden w-full md:block md:max-w-sm">
      <div className="editorial-surface sticky top-24 rounded-2xl p-5">
        <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
          相关文章
        </h2>
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => {
              const article: Post = {
                id: post.id,
                title: post.title,
                tags: post.tags,
                category: post.category,
                slug: post.slug,
                summarize: post.summarize,
                publishDay: post.publishDay,
                lastEditedDate: post.lastEditedDate,
                pageCover: post.pageCover || "",
                pageCoverThumbnail: post.pageCoverThumbnail || "",
              };

              return (
                <li key={post.id}>
                  <EditorialArticleCard article={article} variant="compact" />
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-subtle">暂无相关文章</p>
        )}
      </div>
    </aside>
  );
};

export default RelatedPosts;
