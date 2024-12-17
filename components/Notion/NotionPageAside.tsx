import React, { useMemo } from "react";
import Link from "next/link";
import * as Types from "@/lib/type";
import Sidebar from "@/components/Sidebar";

interface NotionPageAsideProps {
  relatedPosts?: Types.PostData[];
}

const NotionPageAside: React.FC<NotionPageAsideProps> = ({
  relatedPosts = [],
}) => {
  // 使用 useMemo 缓存相关文章列表
  const renderedPosts = useMemo(() => {
    if (!relatedPosts.length) {
      return <p className="text-gray-500 text-sm italic">暂无相关文章</p>;
    }

    return (
      <ul className="space-y-3">
        {relatedPosts.map((post) => (
          <li
            key={post.id}
            className="group hover:bg-gray-50 rounded-lg transition-all duration-200 p-2"
          >
            <Link href={`/posts/${post.id}`} className="block">
              <h3
                className="text-sm font-medium text-gray-900  group-hover:text-[#bec088]
                           line-clamp-2 mb-1 transition-colors duration-200"
              >
                {post.title}
              </h3>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 
                               rounded-full group-hover:bg-blue-50 
                               group-hover:text-[#bec088] transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </li>
        ))}
      </ul>
    );
  }, [relatedPosts]);

  return (
    <aside className="xs:hidden block mt-4">
      <Sidebar />

      {/* 相关文章部分 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-2 mt-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <svg
            className="w-5 h-5 mr-2 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          相关推荐
        </h2>
        {renderedPosts}
      </div>
    </aside>
  );
};

export default React.memo(NotionPageAside);
