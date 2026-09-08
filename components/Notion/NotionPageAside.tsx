/** 在 Notion 文章侧栏显示简洁的相关文章标题列表。 */
import React, { useMemo } from "react";
import Link from "next/link";
import * as Types from "@/lib/type";
import { canonicalArticlePath } from "@/lib/routing/articleRoute";

interface NotionPageAsideProps {
  relatedPosts?: Types.Post[];
}

const NotionPageAside: React.FC<NotionPageAsideProps> = ({
  relatedPosts = [],
}) => {
  const renderedPosts = useMemo(
    () => (
      <ol className="list-decimal space-y-2 pl-5 text-sm leading-6 text-ink">
        {relatedPosts.map((post) => (
          <li key={post.id} className="pl-1 marker:text-subtle">
            <Link
              href={canonicalArticlePath(post)}
              prefetch={false}
              className="editorial-focus rounded-sm transition-colors hover:text-primaryStrong"
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ol>
    ),
    [relatedPosts],
  );

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="w-full p-6">
      <h2 className="mb-4 text-lg font-semibold tracking-tight text-ink">
        还可以读读
      </h2>
      {renderedPosts}
    </section>
  );
};

export default React.memo(NotionPageAside);
