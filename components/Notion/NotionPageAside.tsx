import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SocialContactIcon from "@/components/SocialContactIcon";
import * as Types from "@/lib/type";

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
                className="text-sm font-medium text-gray-900 group-hover:text-blue-600 
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
                               group-hover:text-blue-600 transition-colors duration-200"
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
    <aside className="bg-white rounded-xl shadow-sm border border-gray-100">
      {/* 用户信息部分 */}
      <div className="p-4 text-center border-b border-gray-100">
        <div className="relative w-20 h-20 mx-auto mb-3">
          <Image
            src="/avatar.jpg"
            alt="Author avatar"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <h2 className="text-lg font-bold text-gray-900">Yiyang</h2>
        <p className="text-sm text-gray-600 mt-1">Frontend Developer</p>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          热爱前端开发，分享技术经验和生活感悟
        </p>
        
        {/* 统计信息 */}
        <div className="flex justify-center gap-4 mt-3">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">120</div>
            <div className="text-xs text-gray-500">文章</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">1.2k</div>
            <div className="text-xs text-gray-500">访问</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">89</div>
            <div className="text-xs text-gray-500">订阅</div>
          </div>
        </div>
      </div>

      {/* 订阅部分 */}
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-900 mb-3">订阅更新</h3>
        <form className="space-y-2">
          <input
            type="email"
            placeholder="输入您的邮箱"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 
                     rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            订阅
          </button>
        </form>
      </div>

      {/* 相关文章部分 */}
      <div className="p-4 border-b border-gray-100">
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

      {/* 社交图标部分 */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">关注我</h3>
        <SocialContactIcon />
      </div>
    </aside>
  );
};

export default React.memo(NotionPageAside);
