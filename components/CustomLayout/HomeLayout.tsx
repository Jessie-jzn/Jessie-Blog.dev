import { motion } from "framer-motion";
import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import CardPost from "@/components/CustomLayout/CardPost";
import Image from "next/image";
import Link from "next/link";
import SectionFAQ from "./SectionFAQ";
import TypedEffect from "./TypedEffect";

const HomeLayout = ({ posts }: { posts: Types.Post[] }) => {
  const { t } = useTranslation("common");
  const typedTexts: string[] = t("typedTexts", {
    returnObjects: true,
  }) as string[];
  const features = t("features", { returnObjects: true }) as Types.Feature[];

  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative bg-[#bec088] dark:bg-gray-950 text-gray-100 py-16 pt-[190px]"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={fadeInUp}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 px-8 md:px-12 lg:px-16 mb-12 md:mb-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              👋 Hello,I&apos;m Jessie
            </h2>
            <div className="h-10">
              <TypedEffect
                texts={typedTexts}
                typeSpeed={80}
                deleteSpeed={40}
                pauseTime={1000}
                loop={true}
                textStyle={{
                  fontSize: "24px",
                }}
              />
            </div>

            <div className="text-lg md:text-xl leading-relaxed">
              <p className="mb-2">{t("authorDesc")}</p>
            </div>
            <SocialContactIcon
              prop={{
                className: "mb-3 flex space-x-4 mt-8 text-gray-100",
                theme: "white",
              }}
            />

            <Link href={"/about"}>
              <div className="mt-4 w-52 p-4 bg-[#D4D268] hover:bg-[#B4B165] text-black font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 text-center">
                {t("workWithMe")}
              </div>
            </Link>
          </div>
          <div className="md:w-1/2 px-8 md:px-12 lg:px-16 xs:hidden">
            <Image
              src={require("@/public/images/image1.jpg")}
              alt="New Home Builders"
              width={700}
              height={400}
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </motion.section>

      {!!features.length && (
        <motion.section
          className="bg-[#f8f5dc] py-36 xs:py-12 dark:bg-gray-950"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          variants={fadeInUp}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features?.map((f, index) => (
                <Link key={index} href={f.href}>
                  <motion.div
                    key={index}
                    className="flex flex-col items-start text-left relative"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: index * 0.2 }}
                    variants={fadeInUp}
                  >
                    <Image
                      src={require(`@/public/${f.icon}`)}
                      alt={f.title}
                      className="rounded-lg object-cover w-full h-96"
                    />
                    <div className="absolute bottom-4 left-4 px-3 bg-black bg-opacity-50">
                      <h3 className="text-5xl font-semibold text-gray-100 mb-4">
                        {f.title}
                      </h3>
                      <p className="text-gray-100 dark:text-white">
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

      {/* Services Section */}
      <motion.section
        className="bg-[#fffaeb] dark:bg-gray-900 p-8 py-32"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={fadeInUp}
      >
        <h2 className="text-6xl font-bold mb-10 font-serif">{t("lastPost")}</h2>

        <div className="grid lg:grid-cols-5 sm:grid-cols-3 gap-8">
          {posts.map((p: Types.Post) => (
            <motion.div
              key={p.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              variants={fadeInUp}
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
      </motion.section>
      <SectionFAQ />

      {/* Contact Section */}
      <motion.section
        className="bg-[#bec088] p-16 flex xs:flex-col justify-center items-center dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        variants={fadeInUp}
      >
        <div className="flex flex-wrap justify-around w-full pb-8">
          <div className="flex flex-col xs:max-w-xs mb-2">
            <h2 className="text-2xl lg:text-4xl font-bold text-zinc-100 dark:text-zinc-100">
              {t("about")}
            </h2>
            <p className="mt-2 md:text-xl text-zinc-100 dark:text-zinc-400">
              {SiteConfig.description}
            </p>
            <p className="mt-4 md:text-xl text-zinc-100 dark:text-zinc-400">
              <strong>{t("contact")} :</strong> {SiteConfig.email}
            </p>
          </div>
        </div>

        <div className="max-w-4xl w-full bg-[#fffaeb] rounded-3xl p-12 ">
          <h1 className="text-center text-3xl font-bold mb-6">
            {t("subscribe")}
          </h1>

          <h3 className="text-center font-semibold mb-8 text-black">
            {t("subscribeDesc")}
          </h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="First Name"
                  className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
                />
              </div>
              <div className="flex flex-col">
                <input
                  type="text"
                  placeholder="Last Name"
                  className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Email"
                className="mt-2 p-3 rounded-full bg-[#bec088] text-white focus:outline-none placeholder:text-white"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 w-56 p-8 py-4 bg-[#4d472f] text-white rounded-full hover:bg-[#5e5639]"
              >
                {t("subscribe")}
              </button>
            </div>
          </form>
        </div>
      </motion.section>
    </>
  );
};

export default HomeLayout;
