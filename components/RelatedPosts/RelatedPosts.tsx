import React from 'react';

interface Tag {
  id: string;
  name: string;
}

interface RelatedPost {
  id: string;
  title: string;
  tags: Tag[];
}

interface RelatedPostsProps {
  posts: RelatedPost[];
  isLoading?: boolean;
  error?: Error | null;
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="w-64 hidden md:block">
        <div className="sticky top-24">
          <h3 className="text-xl font-bold mb-4">相关文章</h3>
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-64 hidden md:block">
        <div className="sticky top-24">
          <h3 className="text-xl font-bold mb-4">相关文章</h3>
          <p className="text-red-500">加载失败</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 hidden md:block">
      <div className="sticky top-24">
        <h3 className="text-xl font-bold mb-4">相关文章</h3>
        {posts.length > 0 ? (
          <ul className="space-y-4">
            {posts.map((post) => (
              <li key={post.id}>
                <a
                  href={`/posts/${post.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  {post.title}
                </a>
                <div className="flex flex-wrap gap-2 mt-1">
                  {post.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs bg-gray-200 rounded-full px-2 py-1"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">暂无相关文章</p>
        )}
      </div>
    </div>
  );
};

export default RelatedPosts;
