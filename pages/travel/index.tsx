import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import { NOTION_POST_ID } from "@/lib/constants";
import Image from "next/image";
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import Link from "next/link";
import TravelListLayout from "@/components/layouts/TravelListLayout";
import { useTranslation } from "next-i18next";
import { processTags } from "@/lib/util";

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  const response = await getDataBaseList({
    pageId: NOTION_POST_ID,
    from: "home-index",
    filter: (post: any) =>
      post.category === "travel-en" || post.category === "travel-zh",
  });
  // 根据当前语言决定显示顺序
  const primaryKey = locale === "en" ? "travel-en" : "travel-zh";
  const secondaryKey = locale === "en" ? "travel-zh" : "travel-en";

  const primaryPosts = response.categoryMap?.[primaryKey]?.articles || [];
  const secondaryPosts = response.categoryMap?.[secondaryKey]?.articles || [];

  // 合并文章列表
  const allPosts = [...primaryPosts, ...secondaryPosts];

  // 使用封装的函数处理标签
  const tagMap = processTags(response.tagOptions || []);

  // 转换回数组形式
  const uniqueTagOptions = Array.from(tagMap.values());

  return {
    props: {
      posts: allPosts,
      tagOptions: uniqueTagOptions,
      ...(await serverSideTranslations(locale || "zh", ["common"])),
    },
    revalidate: 10,
  };
};

const TravelListPage = ({ posts, tagOptions }: any) => {
  const { t } = useTranslation("common");
  const [curTab, setCurTab] = useState("All");
  const [postList, setPostList] = useState(posts);

  const category = "travel";

  // 更新动画变体
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const headerVariants = {
    initial: { opacity: 0, y: -50 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const tabItemVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      color: "#62BFAD",
      transition: {
        type: "spring",
        stiffness: 400,
      },
    },
    active: {
      scale: 1.1,
      color: "#62BFAD",
      textShadow: "0 0 8px rgba(98, 191, 173, 0.3)",
    },
  };

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const handleChangeTab = (item: Types.Tag) => {
    setCurTab(item.id);
    setPostList(item.articles);
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="min-h-screen"
      style={{
        background: `
          linear-gradient(to bottom, 
            #F9F7E8,
            rgba(255, 255, 255, 0.95) 30%,
            rgba(249, 247, 232, 0.8) 70%,
            #F9F7E8 100%
          ),
          radial-gradient(
            circle at 20% 30%, 
            rgba(98, 191, 173, 0.08) 0%, 
            transparent 50%
          ),
          radial-gradient(
            circle at 80% 70%, 
            rgba(98, 191, 173, 0.05) 0%, 
            transparent 50%
          ),
          #F9F7E8
        `,
      }}
    >
      <motion.header
        className="relative w-full h-[75vh] xs:h-[50vh] bg-cover bg-center flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('${SiteConfig.imageDomainUrl}image6.jpg')`,
          backgroundPosition: "center 30%",
          backgroundSize: "cover",
        }}
      >
        {/* 更新渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70" />

        {/* 文字内容 */}
        <motion.div className="relative flex flex-col items-center justify-center px-4 space-y-6">
          <motion.h2
            className="text-6xl xs:text-3xl font-bold text-white leading-tight text-center tracking-wide drop-shadow-xl"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {t("travel.title")}
          </motion.h2>
          <motion.div
            className="text-xl xs:text-sm font-medium text-white/95 leading-relaxed text-center max-w-2xl backdrop-blur-sm  p-6 rounded-2xl borde"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            {t("travel.description")}
          </motion.div>
        </motion.div>

        {/* 更新波浪效果 */}
        {/* <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <svg
            viewBox="0 0 1440 350"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="waveGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(249, 247, 232, 0.9)" />
                <stop offset="100%" stopColor="#F9F7E8" />
              </linearGradient>
            </defs>
            <motion.path
              fill="url(#waveGradient)"
              className="dark:fill-gray-950/95"
              animate={{
                d: [
                  "M0,224L60,218.7C120,213,240,203,360,213.3C480,224,600,256,720,266.7C840,277,960,267,1080,250.7C1200,235,1320,213,1380,202.7L1440,192L1440,350L0,350Z",
                  "M0,256L60,250C120,244,240,228,360,224C480,220,600,228,720,232C840,236,960,236,1080,224C1200,212,1320,192,1380,176L1440,160L1440,350L0,350Z",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              }}
            />
          </svg>
        </div> */}
      </motion.header>

      <motion.div className="relative px-8 xs:px-4 py-16 xs:py-8 w-full min-h-screen">
        {/* 标签导航栏 */}
        <motion.nav
          className="relative text-center w-full box-border mb-10 xs:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-start md:justify-center gap-3 xs:gap-2 py-1 px-2 overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
            <motion.div
              className={`px-4 py-1.5 text-sm xs:text-xs font-medium rounded-full cursor-pointer transition-all
                ${
                  curTab === "All"
                    ? "bg-gradient-to-r from-[#62BFAD] to-[#62BFAD]/90 text-white shadow-sm hover:shadow-md"
                    : "text-gray-600 dark:text-gray-300 hover:bg-[#62BFAD]/5 hover:text-[#62BFAD]"
                }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() =>
                handleChangeTab({
                  id: "All",
                  articles: posts,
                  count: posts?.length,
                  value: t("travel.tabs.all"),
                })
              }
            >
              {t("travel.tabs.all")}{" "}
              <span className="text-xs opacity-70">({posts?.length})</span>
            </motion.div>

            {tagOptions?.map((tag: Types.Tag) => (
              <motion.div
                key={tag.id}
                className={`px-4 py-1.5 text-sm xs:text-xs font-medium rounded-full cursor-pointer transition-all
                  ${
                    curTab === tag.id
                      ? "bg-gradient-to-r from-[#62BFAD] to-[#62BFAD]/90 text-white shadow-sm hover:shadow-md"
                      : "text-gray-600 dark:text-gray-300 hover:bg-[#62BFAD]/5 hover:text-[#62BFAD]"
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleChangeTab(tag)}
              >
                {tag.name}{" "}
                <span className="text-xs opacity-70">({tag.count})</span>
              </motion.div>
            ))}
          </div>
        </motion.nav>

        {/* 文章卡片网格 */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 xs:gap-4">
          {postList.map((post: any, index: number) => (
            <motion.div
              key={post.id}
              variants={cardVariants}
              whileHover="hover"
              layout
              custom={index}
            >
              <Link href={`${category}/${post.id}`}>
                <div className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-[#F9F7E8] dark:border-white/5">
                  <div className="relative overflow-hidden aspect-[3/2]">
                    <Image
                      src={post.pageCover}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  <div className="p-5 xs:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-sans py-0.5 text-gray-600 dark:text-gray-400 ">
                        {post.lastEditedDate}
                      </span>
                    </div>

                    <h2 className="text-base xs:text-sm mb-2 line-clamp-2 group-hover:text-[#62BFAD] transition-colors">
                      {post.title}
                    </h2>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {[...(post.city || []), ...(post.sorts || [])].map(
                        (tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 rounded-full"
                          >
                            {tag}
                          </span>
                        )
                      )}
                    </div>

                    <p className="text-sm xs:text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                      {post.slug}
                    </p>

                    <div className="flex items-center text-[#62BFAD] text-sm xs:text-xs font-medium group-hover:translate-x-2 transition-transform">
                      Read More
                      <svg
                        className="w-3.5 h-3.5 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

TravelListPage.getLayout = (page: React.ReactElement) => {
  return <TravelListLayout>{page}</TravelListLayout>;
};

export default TravelListPage;
