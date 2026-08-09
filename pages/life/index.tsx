/**
 * 生活分类页：从 Notion 获取按语言筛选的生活文章及对应国际化数据。
 */
import { GetStaticProps } from "next";
import { NOTION_POST_ID } from "@/lib/constants";
import { motion } from "framer-motion";
import getLocalizedCategoryPosts from "@/lib/notion/getLocalizedCategoryPosts";
import { useTranslation } from "next-i18next";
import PageHeader from "@/components/common/PageHeader";
import EditorialArticleCard from "@/components/articles/EditorialArticleCard";
import type { Post as Article } from "@/lib/type";

const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
};

export const getStaticProps: GetStaticProps = async ({ locale = "en" }) => {
  const { posts, translations } = await getLocalizedCategoryPosts({
    locale,
    pageId: NOTION_POST_ID,
    from: "life-index",
    categories: ["life-en", "life-zh"],
    useCache: true,
  });

  return {
    props: {
      posts: posts,
      ...translations,
    },
    revalidate: 10,
  };
};

const Post = ({ posts }: any) => {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <PageHeader
        eyebrow={t("lastPost")}
        title={t("nav.life")}
        meta={`${posts?.length || 0} ${t("post")}`}
      />

      <div className="site-container pb-16 md:pb-24">
        <div className="space-y-6">
          {posts?.map((post: Article, index: number) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              <EditorialArticleCard
                article={post}
                variant="row"
                priority={index === 0}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Post;
