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

  console.log("uniqueTagOptions", response.tagOptions);
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

  const tabItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1, color: "#62BFAD" },
    active: { scale: 1.2, color: "#62BFAD" },
  };

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // 卡片逐一动画出现
      },
    },
  };

  const handleChangeTab = (item: Types.Tag) => {
    setCurTab(item.id);
    setPostList(item.articles);
  };

  return (
    <>
      <header
        className="relative w-full h-[80vh] xs:h-[50vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('${SiteConfig.imageDomainUrl}image6.jpg')`,
        }}
      >
        <div className="flex flex-col items-center justify-center px-4">
          <h2 className="text-6xl xs:text-xl font-extrabold text-white leading-tight mb-6 xs:mb-4 text-center">
            {t("travel.title")}
          </h2>
          <div className="text-3xl xs:text-sm font-extrabold text-white leading-tight mb-6 xs:mb-4 text-center">
            {t("travel.description")}
          </div>
        </div>
      </header>
      <motion.div
        className="px-8 xs:px-4 py-12 xs:py-8 w-full bg-[#F9F7E8] dark:bg-gray-950 min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <nav className="text-center w-full box-border mb-8 xs:mb-6 flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap scrollbar-hide">
          <motion.div
            className="text-lg xs:text-base font-semibold mx-4 xs:mx-2 cursor-pointer"
            onClick={() =>
              handleChangeTab({
                id: "All",
                articles: posts,
                count: posts?.length,
                value: t("travel.tabs.all"),
              })
            }
            variants={tabItemVariants}
            initial="initial"
            animate={curTab === "All" ? "active" : "initial"}
            whileHover="hover"
          >
            {t("travel.tabs.all")} ({posts?.length})
          </motion.div>
          {tagOptions?.map((tag: Types.Tag) => (
            <motion.div
              key={tag.id}
              className="text-lg xs:text-base font-semibold mx-4 xs:mx-2 cursor-pointer"
              onClick={() => handleChangeTab(tag)}
              variants={tabItemVariants}
              initial="initial"
              animate={curTab === tag.id ? "active" : "initial"}
              whileHover="hover"
            >
              {tag.name} ({tag.count})
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="grid grid-cols-2 xs:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 xs:gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {postList.map((post: any) => (
            <Link href={`${category}/${post.id}`} key={post.id}>
              <motion.div
                className="rounded-lg overflow-hidden"
                variants={cardVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="overflow-hidden w-full max-h-44 rounded-lg">
                  <Image
                    src={post.pageCover}
                    alt={post.title}
                    width={640}
                    height={360}
                    layout="responsive"
                    quality={75}
                    loading="lazy"
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 xs:p-3">
                  <div className="text-gray-500 xs:text-sm mb-2">
                    {post.lastEditedDate}
                  </div>
                  <h2 className="text-xl xs:text-base font-bold">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap items-center">
                    {post.city?.map((s: string) => (
                      <h3
                        className="text-xs font-mono mt-2 mr-2 bg-[#62BFAD] px-1 rounded-sm h-4"
                        key={s}
                      >
                        {s}
                      </h3>
                    ))}
                    {post.sorts?.map((s: string) => (
                      <h3
                        className="text-xs font-mono mt-2 mr-2 bg-[#62BFAD] px-1 rounded-sm h-4"
                        key={s}
                      >
                        {s}
                      </h3>
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2 line-clamp-5 xs:line-clamp-3 xs:text-sm">
                    {post.slug}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </>
  );
};

TravelListPage.getLayout = (page: React.ReactElement) => {
  return <TravelListLayout>{page}</TravelListLayout>;
};

export default TravelListPage;
