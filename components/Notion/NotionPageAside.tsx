import React from "react";
import SocialContactIcon from "@/components/SocialContactIcon";

interface NotionPageAsideProps {
  relatedArticles?: { id: string; title: string; slug: string }[];
}

const NotionPageAside: React.FC<NotionPageAsideProps> = ({ relatedArticles }) => {
  return (
    <div className="bg-white mt-5 p-4 rounded shadow-md">
      <h2 className="text-lg font-bold mb-4">相关推荐</h2>
      <SocialContactIcon />
      <ul className="space-y-2">
        {relatedArticles?.map((article) => (
          <li key={article.id} className="border-b pb-2">
            <a href={`/articles/${article.slug}`} className="text-blue-600 hover:underline">
              {article.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotionPageAside;
