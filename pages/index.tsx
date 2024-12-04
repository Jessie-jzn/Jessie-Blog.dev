import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/layouts/HomeLayout/index";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { baiduTranslate } from '@/lib/baidu/baiduTranslate';
// import { useEffect } from "react";
import { CommonSEO } from "@/components/SEO";
import * as Types from "@/lib/type";
import { useTranslation } from "next-i18next";
import { motion } from "framer-motion";
import SocialContactIcon from "@/components/SocialContactIcon";
import CardPost from "@/components/CustomLayout/CardPost";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, lazy, useState } from "react";
import TypedEffect from "@/components/TypedEffect"


// 动态导入非关键组件
const SectionFAQ = dynamic(() => import("@/components/SectionFAQ"), {
  suspense: true,
});

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  console.log("locale", locale);
  let posts;
  // 根据语言选择不同的 Notion ID
  const notionPostId = locale === "en" ? NOTION_POST_EN_ID : NOTION_POST_ID;

  if (!SiteConfig.useCustomHomeLayout) {
    posts = await notionService.getPage(NOTION_HOME_ID);
  } else {
    const response = await getDataBaseList({
      pageId: notionPostId,
      from: "home-index",
    });
    posts = response.allPages?.slice(0, 15) || [];
  }

  return {
    props: {
      posts,
      ...(await serverSideTranslations(locale, ["common"])),
    },
    revalidate: 10,
  };
};
const Home = ({ posts }: any) => {
  const { t } = useTranslation("common");
  const typedTexts: string[] = t("typedTexts", {
    returnObjects: true,
  }) as string[];
  const features = t("features", { returnObjects: true }) as Types.Feature[];
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus("loading");

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      if (response.ok) {
        setSubscribeStatus("success");
        setEmail("");
        setFirstName("");
        setLastName("");
      } else {
        const data = await response.json();
        throw new Error(data.error);
      }
    } catch (error: any) {
      setSubscribeStatus("error");
      console.error("Subscription error:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
      },
    },
  };
  // async function main() {
  //   try {
  //     const translatedText = await baiduTranslate('Hello, world!', 'en', 'zh');
  //     console.log('Translated text:', translatedText);
  //   } catch (error) {
  //     console.error('Translation error:', error);
  //   }
  // }
  // useEffect(() => {
  //   main();
  // }, [])

  return (
    <>
      <CommonSEO
        title="首页 - Jessie的博客"
        description="欢迎来到Jessie的博客，分享技术、旅行故事和小贴士。"
      />

      <main className="min-h-screen w-full mx-auto overflow-x-hidden">
          {/* Hero Section - 调整移动端布局和字体大小 */}
          <motion.section
            className="relative bg-[#bec088] dark:bg-gray-950 text-gray-100 xs:py-8 py-12"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between xs:px-4 px-24">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <motion.div
                  className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6"
                  variants={itemVariants}
                >
                  👋 Hello, I&apos;m Jessie
                </motion.div>
                <motion.div className="h-8 md:h-10" variants={itemVariants}>
                  <TypedEffect
                    texts={typedTexts}
                    typeSpeed={80}
                    deleteSpeed={40}
                    pauseTime={1000}
                    loop={true}
                    textStyle={{
                      fontSize: "18px",
                      "@media (min-width: 768px)": {
                        fontSize: "24px",
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  className="text-base md:text-xl leading-relaxed"
                  variants={itemVariants}
                >
                  <p className="mb-2">{t("authorDesc")}</p>
                </motion.div>
                <motion.div variants={itemVariants}>
                  <SocialContactIcon
                    prop={{
                      className: "mb-3 flex space-x-3 md:space-x-4 mt-6 md:mt-8 text-gray-100",
                      theme: "white",
                    }}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Link href={"/about"}>
                    <div className="mt-4 w-full md:w-52 p-3 md:p-4 bg-[#D4D268] hover:bg-[#B4B165] text-black font-semibold rounded-full shadow-lg transition-colors duration-300 text-center text-sm md:text-base">
                      {t("workWithMe")}
                    </div>
                  </Link>
                </motion.div>
              </div>
              <motion.div
                className="w-full md:w-1/2 px-4 md:px-12 lg:px-16 hidden md:block"
                variants={itemVariants}
              >
                <Image
                  src={`${SiteConfig.imageDomainUrl}/image1.webp`}
                  alt="New Home Builders"
                  width={700}
                  height={400}
                  quality={75}
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-lg shadow-lg"
                  loading="eager"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* Features Section - 调整网格布局 */}
          {!!features.length && (
            <motion.section
              className="bg-[#f8f5dc] py-10 md:py-24 dark:bg-gray-950 w-full"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <div className="mx-auto xs:px-4 px-24">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                  {features?.map((f, index) => (
                    <Link key={index} href={f.href}>
                      <motion.div
                        className="flex flex-col items-start text-left relative"
                        variants={{
                          hidden: { x: -50, opacity: 0 },
                          visible: {
                            x: 0,
                            opacity: 1,
                            transition: {
                              type: "spring",
                              stiffness: 50,
                              delay: index * 0.1,
                            },
                          },
                        }}
                      >
                        <Image
                          src={f.icon}
                          alt={f.title}
                          width={100}
                          height={100}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="rounded-lg object-cover w-full h-48 md:h-96"
                          quality={75}
                        />
                        <div className="absolute bottom-4 left-4 px-3 bg-black bg-opacity-50">
                          <h3 className="text-2xl md:text-5xl font-semibold text-gray-100 mb-2 md:mb-4">
                            {f.title}
                          </h3>
                          <p className="text-sm md:text-base text-gray-100 dark:text-white">
                            {f.description}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.section>
          )}

          {/* Posts Section - 调整网格布局和间距 */}
          <motion.section
            className="bg-[#fffaeb] dark:bg-gray-900 xs:py-4 py-16 w-full"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="mx-auto xs:px-4 px-24">
            <motion.h2
              className="text-3xl md:text-6xl font-bold mb-6 md:mb-10 font-serif px-4"
              variants={itemVariants}
            >
              {t("lastPost")}
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-4 gap-4 md:gap-8">
              {posts.map((p: Types.Post, index: number) => (
                <motion.div
                  key={p.id}
                  variants={{
                    hidden: { y: 50, opacity: 0 },
                    visible: {
                      y: 0,
                      opacity: 1,
                      transition: {
                        type: "spring",
                        stiffness: 50,
                        delay: index * 0.05,
                      },
                    },
                  }}
                >
                  <CardPost
                    id={p.id}
                    imageSrc={p.pageCoverThumbnail}
                    title={p.title}
                    description={p.slug}
                  />
                </motion.div>
              ))}
            </div>
            </div>
       
          </motion.section>

          <Suspense fallback={<div>Loading...</div>}>
            <SectionFAQ />
          </Suspense>

          {/* Contact Section - 调整移动端布局和间距 */}
          <motion.section
            className="bg-[#bec088] p-6 md:p-16 flex xs:flex-col justify-center items-center dark:bg-gray-900"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <div className="flex flex-wrap justify-around w-full pb-4 md:pb-8">
              <div className="flex flex-col w-full max-w-lg md:max-w-xs mb-2">
                <h2 className="text-xl md:text-4xl font-bold text-zinc-100 dark:text-zinc-100">
                  {t("about")}
                </h2>
                <p className="mt-2 text-base md:text-xl text-zinc-100 dark:text-zinc-400">
                  {SiteConfig.description}
                </p>
                <p className="mt-4 text-base md:text-xl text-zinc-100 dark:text-zinc-400">
                  <strong>{t("contact")} :</strong> {SiteConfig.email}
                </p>
              </div>
            </div>

            <motion.div
              className="max-w-4xl w-full bg-[#fffaeb] rounded-3xl p-6 md:p-12"
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: "spring",
                    stiffness: 100,
                    damping: 15,
                  },
                },
              }}
            >
              <h1 className="text-2xl md:text-3xl text-center font-bold mb-4 md:mb-6">
                {t("subscribe")}
              </h1>

              <h2 className="text-center text-sm md:text-base font-semibold mb-6 md:mb-8 text-black">
                {t("subscribeDesc")}
              </h2>
              <form className="space-y-6" onSubmit={handleSubscribe}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
                      required
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="mt-4 w-56 p-8 py-4 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639]"
                    disabled={subscribeStatus === "loading"}
                  >
                    {subscribeStatus === "loading"
                      ? t("subscribing")
                      : t("subscribe")}
                  </button>
                </div>
              </form>
              {subscribeStatus === "success" && (
                <p className="mt-4 text-green-600 text-center">
                  {t("subscriptionSuccess")}
                </p>
              )}
              {subscribeStatus === "error" && (
                <p className="mt-4 text-red-600 text-center">
                  {t("subscriptionFailed")}
                </p>
              )}
            </motion.div>
          </motion.section>
        </main>

    </>
  );
};

// 定义该页面使用的布局
Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
