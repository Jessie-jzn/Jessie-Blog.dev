import EditorialArticleCardBody, {
  type EditorialArticleCardVariant,
} from "@/components/articles/EditorialArticleCardBody";
import { resolveLegacyArticleAdapterHref } from "@/components/articles/editorialArticleHref";
import type { Post } from "@/lib/type";

interface LegacyEditorialArticleCardProps {
  article: Post;
  variant?: EditorialArticleCardVariant;
  priority?: boolean;
}

const LegacyEditorialArticleCard = ({
  article,
  variant = "row",
  priority = false,
}: LegacyEditorialArticleCardProps) => (
  <EditorialArticleCardBody
    article={article}
    variant={variant}
    priority={priority}
    href={resolveLegacyArticleAdapterHref(article)}
  />
);

export default LegacyEditorialArticleCard;
