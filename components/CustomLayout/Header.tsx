import React, { useEffect, useState } from "react";
import SiteConfig from "@/site.config";
import dynamic from 'next/dynamic';
import Image from "next/image"; // 确保使用 Next.js 的 Image 组件
import { motion } from "framer-motion";
import { useTranslation } from "next-i18next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { useRouter } from "next/router";

const MobileNav = dynamic(() => import('@/components/MobileNav'));
const ThemeSwitch = dynamic(() => import('@/components/ThemeSwitch'));
const LanguageSwitch = dynamic(() => import('@/components/LanguageSwitch'));

interface HeaderProp {
  btnColor?: string;
}

const Header = ({ btnColor }: HeaderProp) => {
  const { t } = useTranslation("common");
  const [activeLink, setActiveLink] = useState<string>("/");
  const [headerTitle, setHeaderTitle] = useState<string | undefined>(undefined);

  const router = useRouter();

  const menuItemVariants = {
    initial: { opacity: 1, y: 0 },
    hover: { scale: 1.1 }, // 悬停效果 (放大并改变颜色)
    active: { scale: 1.2 }, // 点击效果 (缩小并改变颜色)
  };

  useEffect(() => {
    setActiveLink(router.pathname);
    setHeaderTitle(SiteConfig.headerTitle); // 确保在客户端设置标题
  }, [router.pathname]);

  return (
    <header className="flex items-center justify-between absolute top-0 right-0 w-full p-14 z-[999] h-[192px] box-border">
      <div>
        <Link href="/" aria-label={headerTitle}>
          <div className="flex items-center justify-between">
            <div className="mr-3">
              <Image
                src='https://www.dropbox.com/scl/fi/w25dass9uvsie54sp61gp/avatar.png?rlkey=822a5h3lo1jh120dr0q53i9zg&st=b8oojkui&raw=1' // 使用 WebP 格式
                alt="avatar"
                width={192} // 根据需要调整大小
                height={192}
                quality={75} // 设置压缩质量，默认为75
                priority // 提升优先级，优先加载重要图片
                className="h-16 w-16 rounded-full"
              />
            </div>
            {typeof headerTitle === "string" ? (
              <div className="hidden h-6 sm:block text-3xl font-bold ">
                {headerTitle}
              </div>
            ) : (
              headerTitle
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
            animate={activeLink === link.href ? "active" : "initial"}
            whileHover="hover"
            onClick={() => setActiveLink(link.href)}
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

export default React.memo(Header);
