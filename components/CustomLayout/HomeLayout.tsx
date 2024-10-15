import { motion } from "framer-motion";
import SocialContactIcon from "@/components/SocialContactIcon";
import { useTranslation } from "next-i18next";
import SiteConfig from "@/site.config";
import * as Types from "@/lib/type";
import CardPost from "@/components/CustomLayout/CardPost";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Suspense, lazy, useState } from "react";
import TypedEffect from "./TypedEffect";

// 动态导入非关键组件
const SectionFAQ = dynamic(() => import("./SectionFAQ"), {
  suspense: true,
});

const HomeLayout = ({ posts }: { posts: Types.Post[] }) => {
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

  return (
    <>
      {/* Hero Section */}
      <motion.section
        className="relative bg-[#bec088] dark:bg-gray-950 text-gray-100 py-16 pt-[190px]"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 px-8 md:px-12 lg:px-16 mb-12 md:mb-0">
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
              variants={itemVariants}
            >
              👋 Hello, I&apos;m Jessie
            </motion.h2>
            <motion.div className="h-10" variants={itemVariants}>
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
            </motion.div>

            <motion.div
              className="text-lg md:text-xl leading-relaxed"
              variants={itemVariants}
            >
              <p className="mb-2">{t("authorDesc")}</p>
            </motion.div>
            <motion.div variants={itemVariants}>
              <SocialContactIcon
                prop={{
                  className: "mb-3 flex space-x-4 mt-8 text-gray-100",
                  theme: "white",
                }}
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <Link href={"/about"}>
                <div className="mt-4 w-52 p-4 bg-[#D4D268] hover:bg-[#B4B165] text-black font-semibold py-3 px-8 rounded-full shadow-lg transition-colors duration-300 text-center">
                  {t("workWithMe")}
                </div>
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="md:w-1/2 px-8 md:px-12 lg:px-16 xs:hidden"
            variants={itemVariants}
          >
            <Image
              src='https://www.dropbox.com/scl/fi/p5jykwuc23gopzf7dnpnd/image1.webp?rlkey=q59ji1f207siy21n7t27uatdx&st=7r1p4qlj&raw=1'
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

      {!!features.length && (
        <motion.section
          className="bg-[#f8f5dc] py-36 xs:py-12 dark:bg-gray-950"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                      className="rounded-lg object-cover w-full h-96"
                      quality={75}
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
        variants={containerVariants}
      >
        <motion.h2
          className="text-6xl font-bold mb-10 font-serif"
          variants={itemVariants}
        >
          {t("lastPost")}
        </motion.h2>

        <div className="grid lg:grid-cols-5 sm:grid-cols-3 gap-8">
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
      </motion.section>

      <Suspense fallback={<div>Loading...</div>}>
        <SectionFAQ />
      </Suspense>

      {/* Contact Section */}
      <motion.section
        className="bg-[#bec088] p-16 flex xs:flex-col justify-center items-center dark:bg-gray-900"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
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

        <motion.div
          className="max-w-4xl w-full bg-[#fffaeb] rounded-3xl p-12"
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
          <h1 className="text-center text-3xl font-bold mb-6">
            {t("subscribe")}
          </h1>

          <h2 className="text-center font-semibold mb-8 text-black">
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
    </>
  );
};

export default HomeLayout;
