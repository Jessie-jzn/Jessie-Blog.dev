import { GetStaticProps } from "next";
import { motion } from "framer-motion";
import { NOTION_GUIDE_ID } from "@/lib/constants";
import Image from "next/image";
import * as Types from "@/lib/type";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import CardArticle from "@/components/CustomLayout/CardArticle";
import Link from "next/link";

export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  const response = await getDataBaseList({
    pageId: NOTION_GUIDE_ID,
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
  const [curTab, setCurTab] = useState("ALL");
  const [postList, setPostList] = useState(posts);

  const tabItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1, color: "#bec088" }, // 悬停效果 (放大并改变颜色)
    active: { scale: 1.2, color: "#bec088" }, // 点击效果 (缩小并改变颜色)
  };

  const handleChangeTab = (item: Types.Tag) => {
    console.log("item.articles", item);

    setCurTab(item.id);
    setPostList(item.articles);
  };
  return (
    <div className="px-8 py-12 bg-yellow-50 min-h-screen">
      <nav className="text-center mb-8 flex items-center">
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
          animate={curTab === "ALL" ? "active" : "initial"}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {postList.map((post: any, index: number) => (
          <Link href={`post/${post.id}`} key={post.id}>
            <div key={index} className="rounded-lg overflow-hidden">
              <div className="overflow-hidden w-full h-52 rounded-lg">
                <Image
                  src={post.pageCover}
                  alt={post.title}
                  width={640}
                  height={360}
                  layout="responsive"
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="text-gray-500 mb-2">{post.lastEditedDate}</div>
                <h2 className="text-xl font-bold">{post.title}</h2>
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

                <p className="text-gray-700 mt-2 line-clamp-5">{post.slug}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default Post;
