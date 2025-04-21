import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/layouts/HomeLayout";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_POST_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CommonSEO } from "@/components/SEO";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { getProxiedImageUrl } from "@/utils/imageHelper";
import Carousel from "@/components/Carousel";
import * as Types from "@/lib/type";
import { motion } from "framer-motion";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let posts;
  let technicalPosts = [];
  let travelPosts = [];

  if (!SiteConfig.useCustomHomeLayout) {
    posts = await notionService.getPage(NOTION_HOME_ID);
  } else {
    const response = await getDataBaseList({
      pageId: NOTION_POST_ID,
      from: "home-index",
    });

    posts = response?.allPages?.slice(0, 15) || [];
    const technicalKey = locale === "en" ? "technical-en" : "technical-zh";
    const travelKey = locale === "en" ? "travel-en" : "travel-zh";

    technicalPosts =
      response.categoryMap?.[technicalKey]?.articles.slice(0, 15) || [];
    travelPosts =
      response.categoryMap?.[travelKey]?.articles.slice(0, 15) || [];
  }

  return {
    props: {
      posts,
      technicalPosts,
      travelPosts,
      ...(await serverSideTranslations(locale || "zh", ["common", "home"])),
    },
    revalidate: 10,
  };
};

// Add type definition for the SubTitleRender props
interface SubTitleProps {
  title: string;
  subtitle: string;
  readMoreLink?: string; // Optional link for the "Read More" button
  readMoreText?: string; // Optional custom text for the button
}

// Update the SubTitleRender component with proper typing
const SubTitleRender = ({
  title,
  subtitle,
  readMoreLink = "/blog", // Default to /blog if not specified
}: SubTitleProps) => {
  const { t } = useTranslation("home");

  return (
    <div className="flex items-center justify-between mb-12">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
      <Link href={readMoreLink}>
        <button className="group inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full hover:bg-[#62BFAD] hover:text-white transition-all duration-300 text-sm">
          <span className="font-medium">{t("explore.readMore")}</span>
          <svg
            className="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </button>
      </Link>
    </div>
  );
};

const Home = ({ posts, technicalPosts, travelPosts }: any) => {
  const { t } = useTranslation(["home", "common"]);

  // 确保日期格式一致
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const galleryImages = [
    {
      url: "https://qiniu.jessieontheroad.com/IMG_0482.jpeg",
      alt: t("gallery.images.sunset"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1177.jpeg",
      alt: t("gallery.images.cityStreet"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg",
      alt: t("gallery.images.beach"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/DSC03146.jpeg",
      alt: t("gallery.images.castle"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1083.jpeg",
      alt: t("gallery.images.nightView"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg",
      alt: t("gallery.images.church"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: t("gallery.images.market"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: t("gallery.images.mountain"),
    },
  ];

  const carouselSlides = [
    {
      image: "https://qiniu.jessieontheroad.com/image4.jpg",
      title: t("hero.title"),
      description: t("hero.subtitle"),
      href: "/about",
    },
    {
      image: "https://qiniu.jessieontheroad.com/image6.jpg",
      title: t("travel.title"),
      description: t("travel.description"),
      href: "/travel",
    },
    {
      image: "https://qiniu.jessieontheroad.com/image2.jpg",
      title: t("technical.title"),
      description: t("technical.description"),
      href: "/technical",
    },
  ];

  const testimonials = [
    {
      image: "https://qiniu.jessieontheroad.com/IMG_1083.jpeg",
      content: t("testimonials.reviews.1.content"),
      author: t("testimonials.reviews.1.author"),
    },
    {
      image:
        "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg",
      content: t("testimonials.reviews.2.content"),
      author: t("testimonials.reviews.2.author"),
    },
    {
      image: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      content: t("testimonials.reviews.3.content"),
      author: t("testimonials.reviews.3.author"),
    },
  ];

  const routeCards = [
    {
      href: "/travel/classic-city",
      image: "https://qiniu.jessieontheroad.com/IMG_0482.jpeg",
      titleKey: "routes.classicCity.title",
      descriptionKey: "routes.classicCity.description",
    },
    {
      href: "/travel/nature",
      image: "https://qiniu.jessieontheroad.com/IMG_1177.jpeg",
      titleKey: "routes.nature.title",
      descriptionKey: "routes.nature.description",
    },
    {
      href: "/travel/family",
      image: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg",
      titleKey: "routes.family.title",
      descriptionKey: "routes.family.description",
    },
    {
      href: "/travel/adventure",
      image: "https://qiniu.jessieontheroad.com/DSC03146.jpeg",
      titleKey: "routes.adventure.title",
      descriptionKey: "routes.adventure.description",
    },
  ];

  // 定义探索内容区块的数据结构
  const exploreContent = [
    {
      title: t("explore.technical.title"), // 技术分享标题
      description: t("explore.technical.description"), // 技术分享描述
      image: "https://qiniu.jessieontheroad.com/icon/2801569.jpg", // 技术相关图片
      href: "/technical", // 链接到技术文章列表页
    },
    {
      title: t("explore.travel.title"), // 旅行见闻标题
      description: t("explore.travel.description"), // 旅行见闻描述
      image: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg", // 旅行相关图片
      href: "/travel", // 链接到旅行文章列表页
    },
    {
      title: t("explore.personal.title"), // 生活随笔标题
      description: t("explore.personal.description"), // 生活随笔描述
      image: "https://qiniu.jessieontheroad.com/icon/Telecommuting-cuate.png", // 生活相关图片
      href: "/life", // 链接到博客列表页
    },
    {
      title: t("explore.whver.title"), // WHV经历标题
      description: t("explore.whver.description"), // WHV经历描述
      image: "https://qiniu.jessieontheroad.com/icon/v1052-075.jpg", // WHV相关图片
      href: "/about", // 链接到博客列表页
    },
  ];

  return (
    <div>
      <CommonSEO
        title={t("hero.title", { ns: "common" })}
        description={t("hero.subtitle", { ns: "common" })}
      />

      <main className="min-h-screen w-full mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Carousel slides={carouselSlides} />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-8 bg-white dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 gap-4">
              {exploreContent.map((post, index) => (
                <motion.div
                  key={post.href}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={post.href}>
                    <div className="group">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="relative w-full h-32 mb-3 overflow-hidden rounded-lg bg-gray-100"
                      >
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </motion.div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 leading-snug group-hover:text-[#62BFAD] transition-colors">
                        {post.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{post.description}</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-white dark:bg-gray-900"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {SubTitleRender({
                title: t("featuredPosts.title"),
                subtitle: t("featuredPosts.subtitle"),
                readMoreLink: "/blog",
              })}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <motion.div
                className="lg:col-span-7"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Link
                  href={`/post/${travelPosts[0]?.id}`}
                  className="group block"
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative h-[500px] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={travelPosts[0]?.pageCoverThumbnail}
                      alt={travelPosts[0]?.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80" />
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="mb-3">
                        <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-[#62BFAD] rounded-full">
                          {travelPosts[0]?.tags}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-[#62BFAD] transition-colors">
                        {travelPosts[0]?.title}
                      </h3>
                      <p className="text-gray-200 mb-4 line-clamp-2">
                        {travelPosts[0]?.description}
                      </p>
                      <div className="flex items-center text-gray-300 text-sm">
                        <span className="inline-block w-1 h-1 rounded-full bg-gray-300 mr-2" />
                        {formatDate(travelPosts[0]?.lastEditedDate)}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>

              <motion.div
                className="lg:col-span-5 space-y-6"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {travelPosts.slice(1, 5).map((post: any, index: number) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link href={`/post/${post.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.03, x: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                        className="flex gap-6 group p-2 -mx-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="relative w-36 h-28 flex-shrink-0 overflow-hidden rounded-lg">
                          <Image
                            src={post.pageCoverThumbnail}
                            alt={post.title}
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            loading="lazy"
                            quality={75}
                          />
                        </div>
                        <div className="flex-grow py-1">
                          <div className="mb-2">
                            <span className="text-xs font-medium text-[#62BFAD]">
                              {post.tags}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-[#62BFAD] transition-colors line-clamp-2">
                            {post.title}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span className="inline-block w-1 h-1 rounded-full bg-gray-400 mr-2" />
                            {formatDate(post.lastEditedDate)}
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            {SubTitleRender({
              title: t("travelGuide.title"),
              subtitle: t("travelGuide.subtitle"),
              readMoreLink: "/travelGuide",
            })}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {posts.slice(0, 8).map((post: Types.Post) => (
                <Link
                  key={post.id}
                  href={`/post/${post.id}`}
                  className="group block"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 h-full border border-gray-100 dark:border-gray-700">
                    <div className="relative h-48 xs:h-32 overflow-hidden">
                      <Image
                        src={post.pageCoverThumbnail}
                        alt={post.title}
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        loading="lazy"
                        quality={75}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="p-5 xs:p-2">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-[#62BFAD] bg-[#62BFAD]/5 px-2 py-1 rounded-full">
                          {post.tags[0] || "Travel"}
                        </span>
                      </div>

                      <h5 className="text-base xs:text-xs font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-[#62BFAD] transition-colors">
                        {post.title}
                      </h5>

                      <p className="text-xs xs:hidden text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                        {post.summarize}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(post.lastEditedDate)}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4">
            {SubTitleRender({
              title: t("routes.title"),
              subtitle: t("routes.subtitle"),
              readMoreLink: "/routes",
            })}

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {routeCards.map((card, index) => (
                <Link key={index} href={card.href} className="group block">
                  <div className="relative h-[320px] xs:h-[240px] rounded-xl overflow-hidden">
                    <div className="absolute inset-0">
                      <Image
                        src={getProxiedImageUrl(card.image)}
                        alt={t(card.titleKey)}
                        fill
                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-300" />
                    </div>

                    <div className="relative h-full flex flex-col justify-end p-6">
                      <div className="mb-4 opacity-90">
                        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="1.5"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </span>
                      </div>

                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#62BFAD] transition-colors">
                        {t(card.titleKey)}
                      </h3>
                      <p className="text-sm text-gray-200 line-clamp-2 mb-4 group-hover:text-white/90 transition-colors">
                        {t(card.descriptionKey)}
                      </p>

                      <div className="flex items-center text-sm text-white/80 group-hover:text-[#62BFAD] transition-colors">
                        <span className="font-medium">查看详情</span>
                        <svg
                          className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="py-16 bg-gray-50 dark:bg-gray-950"
        >
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {SubTitleRender({
                title: t("gallery.title"),
                subtitle: t("gallery.subtitle"),
                readMoreLink: "/gallery",
              })}
            </motion.div>

            <div className="grid grid-cols-12 gap-3">
              <motion.div
                className="col-span-6"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="group relative h-[400px] overflow-hidden rounded-lg xs:h-[200px]"
                >
                  <Image
                    src={getProxiedImageUrl(galleryImages[0].url)}
                    alt={galleryImages[0].alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 hidden md:flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-white text-sm font-medium">
                      {galleryImages[0].alt}
                    </span>
                  </div>
                </motion.div>
              </motion.div>

              <div className="col-span-7 grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map((imgIndex) => (
                  <motion.div
                    key={imgIndex}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: imgIndex * 0.1 }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="group relative h-[150px] overflow-hidden rounded-lg"
                    >
                      <Image
                        src={getProxiedImageUrl(galleryImages[imgIndex].url)}
                        alt={galleryImages[imgIndex].alt}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute inset-0 hidden md:flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-white text-sm font-medium">
                          {galleryImages[imgIndex].alt}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
              {t("testimonials.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="group bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                >
                  {/* 图片容器 */}
                  <div className="relative h-48 xs:h-40 overflow-hidden">
                    <Image
                      src={getProxiedImageUrl(testimonial.image)}
                      alt={testimonial.author}
                      fill
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {/* 渐变遮罩 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6 xs:p-4">
                    {/* 引号图标 */}
                    <div className="mb-4">
                      <svg
                        className="w-8 h-8 text-[#62BFAD]/20"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                      </svg>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 text-base xs:text-sm mb-6 line-clamp-4 leading-relaxed">
                      {testimonial.content}
                    </p>

                    {/* 作者信息 */}
                    <div className="flex items-center justify-end">
                      <div className="text-right">
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {testimonial.author}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
