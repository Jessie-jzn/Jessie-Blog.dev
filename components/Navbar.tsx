import React, { useEffect, useState, useMemo, useCallback } from "react";
import SiteConfig from "@/site.config";
import dynamic from "next/dynamic";
import Image from "next/image"; // 确保使用 Next.js 的 Image 组件
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SpeedInsights } from "@vercel/speed-insights/next";

const NavMobile = dynamic(() => import("@/components/NavMobile"));
const ThemeSwitch = dynamic(() => import("@/components/ThemeSwitch"));
const LanguageSwitch = dynamic(() => import("@/components/LanguageSwitch"));

interface NavbarProp {
  btnColor?: string;
  className?: string; // 添加 style 属性
  isFull?: boolean; // 是否是沉浸式头部
  currentTheme?: "light" | "dark";
}

const Navbar = ({
  btnColor,
  className,
  currentTheme = "light",
  isFull = true,
}: NavbarProp) => {
  const { t } = useTranslation("common");
  const [NavbarTitle, setNavbarTitle] = useState<string | undefined>(undefined);
  const router = useRouter();

  const navigationLinks = useMemo(
    () => [
      { id: "home", href: "/", title: t("nav.home") },
      { id: "technical", href: "/technical", title: t("nav.technical") },
      { id: "travel", href: "/travel", title: t("nav.travel") },
      { id: "life", href: "/life", title: t("nav.life") },
      { id: "about", href: "/about", title: t("nav.about") },
    ],
    [t]
  ); // 只依赖 t 函数

  const menuItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1 },
    active: { scale: 1.2 },
  };

  const isActiveLink = useCallback(
    (href: string): boolean => {
      if (href === "/") {
        return router.pathname === "/";
      }
      return (
        router.pathname === href ||
        (router.pathname.startsWith(href) &&
          router.pathname[href.length] === "/")
      );
    },
    [router.pathname]
  );

  useEffect(() => {
    setNavbarTitle(SiteConfig.headerTitle);
  }, []);

  return (
    <div
      className={`w-full p-8 z-[999] mx-auto ${
        isFull ? "absolute top-0 left-0 bg-fixed bg-transparent" : "relative"
      }
        box-border xs:bg-white xs:p-2 xs:h-[52px] dark:xs:bg-slate-950
        ${className}
        `}
    >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4">
        <Link href="/" aria-label={NavbarTitle}>
          <div className="flex items-center justify-center">
            <div className="mr-3">
              <Image
                src={
                  `${SiteConfig.imageDomainUrl}/avatar.png` ||
                  "https://www.dropbox.com/scl/fi/w25dass9uvsie54sp61gp/avatar.png?rlkey=822a5h3lo1jh120dr0q53i9zg&st=rzw9h6j0&dl=0"
                }
                alt="avatar"
                width={192} // 根据需要调整大小
                height={192}
                quality={75} // 设置压缩质量，默认为75
                priority // 提升优先级，优先加载重要图片
                className="h-16 w-16 rounded-full xs:h-8 xs:w-8"
              />
            </div>

            <div
              className={`text-3xl font-bold xs:text-xs text-gray-100 xs:text-gray-900 dark:text-gray-100 ${
                currentTheme === "light" ? "text-gray-900" : "text-gray-100"
              }`}
            >
              {NavbarTitle}
            </div>
          </div>
        </Link>
        <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
          {navigationLinks.map((link) => (
            <motion.div
              key={link.id}
              className={`hidden sm:block font-medium dark:text-gray-100 relative ${
                currentTheme === "light" ? "text-gray-900" : "text-gray-100"
              }`}
              variants={menuItemVariants}
              initial="initial"
              animate={isActiveLink(link.href) ? "active" : "initial"}
              whileHover="hover"
            >
              <Link href={link.href}>{link.title}</Link>
              <motion.div
                className={`absolute bottom-[-6px] left-0 right-0 h-[1px] dark:bg-slate-50 ${
                  currentTheme === "light" ? "bg-slate-950" : "bg-slate-50"
                }`}
                initial={{ scaleX: 0 }}
                animate={{
                  scaleX: isActiveLink(link.href) ? 1 : 0,
                }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}

          <motion.div
            initial="initial"
            whileHover="hover"
            variants={menuItemVariants}
            className="cursor-pointer"
          >
            <ThemeSwitch />
          </motion.div>

          <motion.div
            initial="initial"
            whileHover="hover"
            variants={menuItemVariants}
            className="cursor-pointer"
          >
            <LanguageSwitch btnColor={btnColor} />
          </motion.div>

          <div className="cursor-pointer block sm:hidden">
            <NavMobile />
          </div>
          <Analytics />
          <SpeedInsights />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
