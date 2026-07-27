import React from "react";
import LegacyEditorialArticleCard from "@/components/articles/LegacyEditorialArticleCard";
import * as Types from "@/lib/type";

interface CardChapterListProps {
  article: Types.Post;
  index?: number;
  category?: string;
}

const CardChapterList: React.FC<CardChapterListProps> = ({ article, category }) => {
  const compatibleArticle: Types.Post = {
    ...article,
    category: category ?? article.category,
  };

  return (
    <LegacyEditorialArticleCard
      article={compatibleArticle}
      variant="compact"
    />
  );
};

export default CardChapterList;
