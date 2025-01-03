import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/layouts/HomeLayout/index";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_GUIDE_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CommonSEO } from "@/components/SEO";
import * as Types from "@/lib/type";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { getProxiedImageUrl } from "@/utils/imageHelper";
import Carousel from "@/components/Carousel";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }: any) => {
  console.log("locale", locale);
  let posts;
  // 根据语言选择不同的 Notion ID
  const notionPostId = locale === "en" ? NOTION_POST_EN_ID : NOTION_GUIDE_ID;

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
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const galleryImages = [
    {
      url: "https://qiniu.jessieontheroad.com/IMG_0482.jpeg",
      alt: "日落风景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1177.jpeg",
      alt: "城市街景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg",
      alt: "海滩风景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/DSC03146.jpeg",
      alt: "古堡风景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1083.jpeg",
      alt: "夜景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg",
      alt: "教堂风景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: "市场街景",
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: "山景",
    },
  ];

  const carouselSlides = [
    {
      image: "http://qiniu.jessieontheroad.com/image4.jpg",
      title: "欢迎来到Jessie的世界",
      description: "愿你走遍世界每个角落，遇见最美的风景和故事",
      href: "/about",
    },
    {
      image: "http://qiniu.jessieontheroad.com/image6.jpg",
      title: "分享独特的旅行体验",
      description: "发现不一样的风景,记录旅途中的精彩瞬间",
      href: "/travel",
    },
    {
      image: "http://qiniu.jessieontheroad.com/image2.jpg",
      title: "探索最新的技术实现",
      description:
        "涵盖广泛的技术主题，从基础知识到高级应用，提供详细的教程和深入的分析。",
      href: "/technical",
    },
  ];

  return (
    <div>
      <CommonSEO
        title="首页 - Jessie的旅行日记"
        description="欢迎来到Jessie的旅行日记，分享精彩旅程和独特体验。"
      />

      <main className="min-h-screen w-full mx-auto">
        {/* 使用轮播组件*/}
        <Carousel slides={carouselSlides} />

        {/* 旅行攻略精选 */}
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-950 dark:text-gray-100">
              旅行攻略精选
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              这里是我为你精心挑选的旅行攻略和实用贴士
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {posts.slice(0, 6).map((post: any) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Link href={`/post/${post.id}`}>
                    <Image
                      src={post.pageCoverThumbnail}
                      alt={post.title}
                      width={700}
                      height={400}
                      quality={75}
                      priority
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2 text-gray-950 dark:text-gray-100">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {post.description}
                      </p>
                      <div className="mt-4 text-gray-500 dark:text-gray-500 text-sm">
                        {post.lastEditedDate}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <Link href={"/travel"}>
              <button className="px-8 mt-10 py-3 bg-white text-black rounded-full hover:bg-[#62BFAD] transition">
                查看更多
              </button>
            </Link>
          </div>
        </section>

        {/* 独特旅行路线推荐 */}
        <section className="py-16 bg-[#F9F7E8] dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-950 dark:text-gray-100">
              独特旅行路线推荐
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              无论你是喜欢冒险的背包客，还是追求舒适的家庭游客，这里都有合适的旅行路线推荐。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* 路线卡片 */}
              <Link href="/travel/classic-city" className="block">
                <div className="relative h-[400px] group overflow-hidden rounded-lg">
                  <Image
                    src={getProxiedImageUrl(
                      "https://qiniu.jessieontheroad.com/IMG_0482.jpeg"
                    )}
                    alt="经典城市之旅"
                    width={700}
                    height={400}
                    quality={75}
                    priority
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      经典城市之旅
                    </h3>
                    <p className="text-white text-sm">
                      探索世界各大经典城市，感受独特的城市文化和历史魅力，适合喜欢城市游的你。
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/travel/nature" className="block">
                <div className="relative h-[400px] group overflow-hidden rounded-lg">
                  <Image
                    src={getProxiedImageUrl(
                      "https://qiniu.jessieontheroad.com/IMG_1177.jpeg"
                    )}
                    alt="自然风光路线"
                    width={700}
                    height={400}
                    quality={75}
                    priority
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      自然风光路线
                    </h3>
                    <p className="text-white text-sm">
                      如果你热爱大自然，这些绝美的自然风光路线将带你领略山川湖泊的壮丽，享受宁静的旅行体验。
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/travel/family" className="block">
                <div className="relative h-[400px] group overflow-hidden rounded-lg">
                  <Image
                    src={getProxiedImageUrl(
                      "https://qiniu.jessieontheroad.com/IMG_4648.jpeg"
                    )}
                    alt="家庭亲子游"
                    width={700}
                    height={400}
                    quality={75}
                    priority
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      家庭亲子游
                    </h3>
                    <p className="text-white text-sm">
                      为家庭旅行设计的亲子游路线，涵盖适合小朋友的景点和活动，让全家人都能享受快乐的时光。
                    </p>
                  </div>
                </div>
              </Link>

              <Link href="/travel/adventure" className="block">
                <div className="relative h-[400px] group overflow-hidden rounded-lg">
                  <Image
                    src={getProxiedImageUrl(
                      "https://qiniu.jessieontheroad.com/DSC03146.jpeg"
                    )}
                    alt="探险路线"
                    width={700}
                    height={400}
                    quality={75}
                    priority
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                    <h3 className="text-white text-xl font-semibold mb-2">
                      探险路线
                    </h3>
                    <p className="text-white text-sm">
                      适合寻求刺激和冒险的旅行者，带你体验不一样的旅行方式。
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* 图册 */}
        <section className="py-16 bg-[#F9F7E8] dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-950 dark:text-gray-100">
              图册
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              分享我在旅途中的精彩瞬间
            </p>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {galleryImages.map((image, index) => (
                <div
                  key={index}
                  className={`relative overflow-hidden rounded-lg ${
                    index === 0
                      ? "w-[100%] md:w-[66%] h-[200px] md:h-[400px]"
                      : "w-[48%] md:w-[calc(33%-1rem)] h-[150px] md:h-[300px]"
                  } transition-transform duration-300 hover:scale-105`}
                >
                  <Image
                    src={getProxiedImageUrl(image.url)}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index < 3}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 用户评价 */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-950 dark:text-gray-100">
              我们已经帮助数百位旅行者记录他们的精彩旅程。
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 用户评价卡片 */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={getProxiedImageUrl(
                    "https://qiniu.jessieontheroad.com/IMG_1083.jpeg"
                  )}
                  alt="陈丽的评价"
                  width={400}
                  height={700}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  我非常喜欢Jessie的旅行日记！它让我轻松分享我的旅行故事，真是太棒了！
                </p>
                <p className="text-right font-semibold text-gray-950 dark:text-gray-100">
                  — 陈丽
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={getProxiedImageUrl(
                    "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg"
                  )}
                  alt="张伟的评价"
                  width={400}
                  height={700}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  作为一名旅行爱好者，我很高兴能找到这样一个平台来整理我的旅行攻略。
                </p>
                <p className="text-right font-semibold text-gray-950 dark:text-gray-100">
                  — 张伟
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={getProxiedImageUrl(
                    "https://qiniu.jessieontheroad.com/IMG_1575.jpeg"
                  )}
                  alt="李华的评价"
                  width={400}
                  height={700}
                  className="w-full h-56 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                  Jessie的旅行日记让我能够轻松记录每一次旅行，分享给我的朋友们！
                </p>
                <p className="text-right font-semibold text-gray-950 dark:text-gray-100">
                  — 李华
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

// 定义该页面使用的布局
Home.getLayout = (page: React.ReactElement) => {
  return <HomeLayout>{page}</HomeLayout>;
};

export default Home;
