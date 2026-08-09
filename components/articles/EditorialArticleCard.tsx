/** 将文章数据和规范 canonical Article URL 传入编辑式文章卡片主体。 */
import EditorialArticleCardBody, {
  type EditorialArticleCardVariant,
} from "@/components/articles/EditorialArticleCardBody";
import type { Post } from "@/lib/type";
import { canonicalArticlePath } from "@/lib/routing/articleRoute";

interface EditorialArticleCardProps {
  article: Post;
  variant?: EditorialArticleCardVariant;
  priority?: boolean;
  position?: number;
}

const EditorialArticleCard = ({
  article,
  variant = "row",
  priority = false,
  position,
}: EditorialArticleCardProps) => (
  <EditorialArticleCardBody
    article={article}
    variant={variant}
    priority={priority}
    position={position}
    href={canonicalArticlePath(article)}
  />
);

export type { EditorialArticleCardProps, EditorialArticleCardVariant };
export default EditorialArticleCard;
