import React from "react";

interface RelatedPost {
  id: string;
  title: string;
  tags: string[];
}

interface RelatedPostsProps {
  posts: RelatedPost[];
}

const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
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
                      key={tag}
                      className="text-xs bg-gray-200 rounded-full px-2 py-1"
                    >
                      {tag}
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
