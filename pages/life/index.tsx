import { GetStaticProps } from "next";
// import NotionService from "@/lib/notion/NotionServer";
import { NOTION_POST_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import getLocalizedCategoryPosts from "@/lib/notion/getLocalizedCategoryPosts";

// const notionService = new NotionService();
const cardVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: index * 0.1,
      duration: 0.6,
      ease: [0.23, 1, 0.32, 1],
    },
  }),
  hover: {
    y: -3,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

const contentVariants = {
  hover: {
    x: 4,
    transition: {
      duration: 0.4,
      ease: [0.23, 1, 0.32, 1],
    },
  },
};

export const getStaticProps: GetStaticProps = async ({ locale = "zh" }) => {
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
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="space-y-12">
        {posts?.map((post: any, index: number) => (
          <motion.div
            key={post.id}
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            custom={index}
            className="group"
          >
            <Link href={`${post?.category}/${post?.slug || post.id}`}>
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-black/[0.03] dark:border-white/[0.03] hover:border-black/[0.07] dark:hover:border-white/[0.07] hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500">
                <div className="flex flex-col md:flex-row md:items-center">
                  <motion.div
                    className="p-8 flex-1 space-y-4"
                    variants={contentVariants}
                  >
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400 font-light tracking-wide">
                      <time
                        dateTime={post.lastEditedDate}
                        className="tabular-nums"
                      >
                        {post.lastEditedDate}
                      </time>
                      {/* <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" /> */}
                      {/* <span className="capitalize">
                        {post.category?.replace("life-", "")}
                      </span> */}
                    </div>

                    <h2 className="text-xl font-medium leading-relaxed text-gray-900 dark:text-gray-100 group-hover:text-[#62BFAD] transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed line-clamp-2 font-light">
                      {post.summarize}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {[...(post.city || []), ...(post.sorts || [])].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 rounded-full font-light border border-black/[0.02] dark:border-white/[0.02]"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>
                  </motion.div>

                  <div className="relative w-full md:w-64 aspect-[16/10] md:aspect-[4/3] overflow-hidden bg-gray-50 dark:bg-gray-900/50">
                    <motion.div
                      className="w-full h-full"
                      variants={imageVariants}
                    >
                      <Image
                        src={post.pageCover}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </motion.div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Post;
