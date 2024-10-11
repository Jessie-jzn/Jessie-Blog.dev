import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import { NOTION_GUIDE_ID,NOTION_GUIDE_EN_ID } from "@/lib/constants";
import Image from "next/image";
import * as Types from "@/lib/type";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import CardArticle from "@/components/CustomLayout/CardArticle";
import Link from "next/link";
import { useTranslation } from "next-i18next";
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const notionPostId = locale === "en" ? NOTION_GUIDE_EN_ID : NOTION_GUIDE_ID;
  const response = await getDataBaseList({
    pageId: notionPostId,
    from: "travel-index",
  });

  return {
    props: {
      posts: response.allPages,
      tagOptions: response.tagOptions,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};

const Post = ({ posts, tagOptions }: any) => {
  const { t } = useTranslation("common");
  const [curTab, setCurTab] = useState("All");
  const [postList, setPostList] = useState(posts);

  const category = 'travel'

  const tabItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1, color: "#bec088" },
    active: { scale: 1.2, color: "#bec088" },
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
      {/* 新增的头部 */}
      <header
        className="relative w-full h-[700px] bg-cover bg-center p-8 xs:h-[300px] pt-[190px]"
        style={{ backgroundImage: `url('/images/image6.jpg')` }}
      >
        {/* 左侧内容 */}
        <div className="flex flex-col justify-center ml-12">
          {/* 主标题 */}
          <h2 className="text-6xl xs:text-2xl font-extrabold text-white leading-tight mb-6">
            {t('travelTitle')}
          </h2>
          <div className="text-3xl xs:text-2xl font-extrabold text-white leading-tight mb-6">
          {t('travelDesc')}
          </div>
        </div>
      </header>
      <motion.div
        className="px-8 xs:px-4 py-12 w-full bg-yellow-50 min-h-screen"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <nav className="text-center w-full box-border mb-8 flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap">
          <motion.div
            className="text-lg font-semibold mx-4 cursor-pointer"
            onClick={() =>
              handleChangeTab({
                id: "All",
                articles: posts,
                count: posts?.length,
                value: "全部",
              })
            }
            variants={tabItemVariants}
            initial="initial"
            animate={curTab === "All" ? "active" : "initial"}
            whileHover="hover"
          >
            全部({posts?.length})
          </motion.div>
          {tagOptions.map((t: Types.Tag) => (
            <motion.div
              key={t.id}
              className="text-lg font-semibold mx-4 cursor-pointer"
              onClick={() => handleChangeTab(t)}
              variants={tabItemVariants}
              initial="initial"
              animate={curTab === t.id ? "active" : "initial"}
              whileHover="hover"
            >
              {t.name}({t.count})
            </motion.div>
          ))}
        </nav>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
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
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-4 xs:p-0">
                  <div className="text-gray-500 mb-2">
                    {post.lastEditedDate}
                  </div>
                  <h2 className="text-xl font-bold xs:text-sm">{post.title}</h2>
                  <div className="flex items-center">
                    {post.sorts.map((s: string) => (
                      <h3
                        className="text-xs font-mono mt-2 mr-2 bg-[#bec088] px-1 rounded-sm h-4"
                        key={s}
                      >
                        {s}
                      </h3>
                    ))}
                  </div>

                  <p className="text-gray-700 mt-2 line-clamp-5 xs:hidden">
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

export default Post;
