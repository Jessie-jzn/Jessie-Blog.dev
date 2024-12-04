import { useState } from "react";
import SiteConfig from "@/site.config";

import NavMobile from "../NavMobile";
import ThemeSwitch from "../ThemeSwitch";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import LanguageSwitch from "../LanguageSwitch";
interface HeaderProp {
  btnColor?: string;
}

const Header = ({ btnColor }: HeaderProp) => {
  const { t } = useTranslation("common");
  const [activeLink, setActiveLink] = useState<number>(1);
  const menuItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1 }, // 悬停效果 (放大并改变颜色)
    active: { scale: 1.2 }, // 点击效果 (缩小并改变颜色)
  };
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md w-full">
      <nav className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-3 overflow-x-hidden">
        <button className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
        </button>
        <div className="hidden md:flex items-center space-x-6">
          <div>
            <Link href="/" aria-label={SiteConfig.headerTitle}>
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Image
                    src={`${SiteConfig.imageDomainUrl}/avatar.png`}
                    alt="avatar"
                    width={192}
                    height={192}
                    loading="lazy"
                    quality={75} // 设置压缩质量，默认为75
                    className="h-16 w-16 rounded-full"
                  />
                </div>
                {typeof SiteConfig.headerTitle === "string" ? (
                  <div className="hidden h-6 sm:block text-3xl font-bold ">
                    {SiteConfig.headerTitle}
                  </div>
                ) : (
                  SiteConfig.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
            {SiteConfig.navigationLinks.map((link) => (
              <motion.div
                key={link.id}
                className="hidden sm:block font-medium text-gray-950 dark:text-gray-100"
                variants={menuItemVariants}
                initial="initial"
                animate={activeLink === link.id ? "active" : "initial"}
                whileHover="hover"
                onClick={() => setActiveLink(link.id)}
              >
                <Link href={link.href}>{t(link.title)}</Link>
                <motion.div
                  className="absolute bottom-[-6px] left-0 right-0 h-[1px] bg-slate-950"
                  variants={{
                    initial: { scaleX: 0, originX: 0 },
                    hover: { scaleX: 1, originX: 0, transition: { duration: 0.3 } },
                    active: {
                      scaleX: 1,
                      originX: 0,
                      transition: { duration: 0.3 },
                    },
                  }}
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

            <motion.div
              initial="initial"
              whileHover="hover"
              variants={menuItemVariants}
              className="cursor-pointer"
            >
              <NavMobile />
            </motion.div>
          </div>
        </div>
      </nav>
      <Analytics />
    </header>
  );
};

export default Header;
