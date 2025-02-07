import { GetStaticProps } from "next";
import NotionService from "@/lib/notion/NotionServer";
import { NOTION_HOME_ID } from "@/lib/constants";
import SiteConfig from "@/site.config";
import HomeLayout from "@/components/layouts/HomeLayout";
import getDataBaseList from "@/lib/notion/getDataBaseList";
import { NOTION_GUIDE_ID, NOTION_POST_EN_ID } from "@/lib/constants";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { CommonSEO } from "@/components/SEO";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import Link from "next/link";
import { getProxiedImageUrl } from "@/utils/imageHelper";
import Carousel from "@/components/Carousel";

const notionService = new NotionService();
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  let posts;
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
      ...(await serverSideTranslations(locale || "zh", ["common"])),
    },
    revalidate: 10,
  };
};
const Home = ({ posts }: any) => {
  const { t } = useTranslation("common");

  const galleryImages = [
    {
      url: "https://qiniu.jessieontheroad.com/IMG_0482.jpeg",
      alt: t("home.gallery.images.sunset"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1177.jpeg",
      alt: t("home.gallery.images.cityStreet"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg",
      alt: t("home.gallery.images.beach"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/DSC03146.jpeg",
      alt: t("home.gallery.images.castle"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1083.jpeg",
      alt: t("home.gallery.images.nightView"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg",
      alt: t("home.gallery.images.church"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: t("home.gallery.images.market"),
    },
    {
      url: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      alt: t("home.gallery.images.mountain"),
    },
  ];

  const carouselSlides = [
    {
      image: "http://qiniu.jessieontheroad.com/image4.jpg",
      title: t("home.hero.title"),
      description: t("home.hero.subtitle"),
      href: "/about",
    },
    {
      image: "http://qiniu.jessieontheroad.com/image6.jpg",
      title: t("home.travel.title"),
      description: t("home.travel.description"),
      href: "/travel",
    },
    {
      image: "http://qiniu.jessieontheroad.com/image2.jpg",
      title: t("home.technical.title"),
      description: t("home.technical.description"),
      href: "/technical",
    },
  ];

  const testimonials = [
    {
      image: "https://qiniu.jessieontheroad.com/IMG_1083.jpeg",
      content: t("home.testimonials.reviews.1.content"),
      author: t("home.testimonials.reviews.1.author"),
    },
    {
      image:
        "https://qiniu.jessieontheroad.com/A16EBBE4-6ADD-4B4D-BEAA-22D92CB54C05.jpeg",
      content: t("home.testimonials.reviews.2.content"),
      author: t("home.testimonials.reviews.2.author"),
    },
    {
      image: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      content: t("home.testimonials.reviews.3.content"),
      author: t("home.testimonials.reviews.3.author"),
    },
  ];

  const routeCards = [
    {
      href: "/travel/classic-city",
      image: "https://qiniu.jessieontheroad.com/IMG_0482.jpeg",
      titleKey: "home.routes.classicCity.title",
      descriptionKey: "home.routes.classicCity.description",
    },
    {
      href: "/travel/nature",
      image: "https://qiniu.jessieontheroad.com/IMG_1177.jpeg",
      titleKey: "home.routes.nature.title",
      descriptionKey: "home.routes.nature.description",
    },
    {
      href: "/travel/family",
      image: "https://qiniu.jessieontheroad.com/IMG_4648.jpeg",
      titleKey: "home.routes.family.title",
      descriptionKey: "home.routes.family.description",
    },
    {
      href: "/travel/adventure",
      image: "https://qiniu.jessieontheroad.com/DSC03146.jpeg",
      titleKey: "home.routes.adventure.title",
      descriptionKey: "home.routes.adventure.description",
    },
  ];

  const exploreContent = [
    {
      title: t("home.explore.technical.title"),
      description: t("home.explore.technical.description"),
      image: "http://qiniu.jessieontheroad.com/image2.jpg",
      href: "/technical",
    },
    {
      title: t("home.explore.travel.title"),
      description: t("home.explore.travel.description"),
      image: "http://qiniu.jessieontheroad.com/image6.jpg",
      href: "/travel",
    },
    {
      title: t("home.explore.personal.title"),
      description: t("home.explore.personal.description"),
      image: "https://qiniu.jessieontheroad.com/IMG_1575.jpeg",
      href: "/blog",
    },
  ];

  return (
    <div>
      <CommonSEO
        title={t("home.hero.title", { ns: "common" })}
        description={t("home.hero.subtitle", { ns: "common" })}
      />

      <main className="min-h-screen w-full mx-auto">
        <Carousel slides={carouselSlides} />

        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">
              {t("home.explore.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              {t("home.explore.subtitle")}
            </p>

            <div className="space-y-12 md:space-y-16">
              {exploreContent.map((content, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center gap-8 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="w-full md:w-1/2">
                    <Link href={content.href}>
                      <div className="relative h-64 md:h-80 overflow-hidden rounded-lg">
                        <Image
                          src={content.image}
                          alt={content.title}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>
                  </div>
                  <div className="w-full md:w-1/2">
                    <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                      {content.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                      {content.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto px-4 flex flex-col justify-center items-center">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {t("home.travelGuide.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              {t("home.travelGuide.subtitle")}
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
            <Link href="/travel">
              <button className="px-8 mt-10 py-3 bg-white text-black rounded-full hover:bg-[#62BFAD] transition">
                {t("home.travelGuide.viewMore")}
              </button>
            </Link>
          </div>
        </section>

        <section className="py-16 bg-[#F9F7E8] dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-950 dark:text-gray-100">
              {t("home.routes.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              {t("home.routes.subtitle")}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {routeCards.map((card, index) => (
                <Link key={index} href={card.href} className="block">
                  <div className="relative h-[400px] group overflow-hidden rounded-lg">
                    <Image
                      src={getProxiedImageUrl(card.image)}
                      alt={t(card.titleKey)}
                      width={700}
                      height={400}
                      quality={75}
                      priority
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                      <h3 className="text-white text-xl font-semibold mb-2">
                        {t(card.titleKey)}
                      </h3>
                      <p className="text-white text-sm">
                        {t(card.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-[#F9F7E8] dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center text-gray-950 dark:text-gray-100">
              {t("home.gallery.title")}
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12">
              {t("home.gallery.subtitle")}
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

        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-950 dark:text-gray-100">
              {t("home.testimonials.title")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <Image
                    src={getProxiedImageUrl(testimonial.image)}
                    alt={testimonial.author}
                    width={400}
                    height={700}
                    className="w-full h-56 object-cover rounded-lg mb-4"
                  />
                  <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
                    {testimonial.content}
                  </p>
                  <p className="text-right font-semibold text-gray-950 dark:text-gray-100">
                    — {testimonial.author}
                  </p>
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
