import { useState } from "react";
import SiteConfig from "../../site.config";

import MobileNav from "../MobileNav";
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
    <header className="flex items-center justify-between py-10">
      <div>
        <Link href="/" aria-label={SiteConfig.headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Image
                src='https://www.dropbox.com/scl/fi/w25dass9uvsie54sp61gp/avatar.png?rlkey=822a5h3lo1jh120dr0q53i9zg&st=b8oojkui&raw=1'
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
          <MobileNav />
        </motion.div>
      </div>

      <Analytics />
    </header>
  );
};

export default Header;
