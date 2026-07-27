import EditorialArticleCard from "@/components/articles/EditorialArticleCard";
import type { Post } from "@/lib/type";

const CardPost = ({
  imageSrc,
  title = "",
  description,
  id = "",
  date = "",
  tag = "",
  category = "",
  slug,
}: {
  id?: string;
  imageSrc?: string;
  title?: string;
  description?: string;
  date?: string;
  tag?: string;
  category?: string;
  slug?: string;
}) => {
  const article: Post = {
    id,
    type: "Post",
    status: "Published",
    tags: tag ? [tag] : [],
    title,
    summarize: description,
    category,
    publishDay: date,
    pageCover: imageSrc || "",
    pageCoverThumbnail: imageSrc || "",
    slug,
  };

  return <EditorialArticleCard article={article} variant="feature" />;
};

export default CardPost;
