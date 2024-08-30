import { FC } from "react";
import Header from "./Header";
import Footer from "./Footer";
// import SiteConfig from "@/site.config";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
interface LayoutProps {
  children: React.ReactNode;
}
const CustomLayout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  // 添加scrollToTop函数
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // 平滑滚动
    });
  };
  useEffect(() => {
    const handleScroll = () => {
      // 判断滚动距离，设置在页面滚动 200px 后显示按钮
      if (window.scrollY > 200) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    // 监听滚动事件
    window.addEventListener("scroll", handleScroll);

    // 组件卸载时移除事件监听器
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <div className="relative w-full bg-[#bec088] dark:bg-gray-950">
      <header>
        <Header btnColor="#d3d58c" />
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />

      {/* 增加返回顶部锚点标签并添加点击动画 */}
      {showScrollToTop && (
        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-[#bec088] text-white p-4 rounded-full shadow-lg hover:bg-[#bec088] transition duration-300"
          whileHover={{ scale: 1.1 }} // 悬停放大效果
          whileTap={{ scale: 0.9 }} // 点击缩小效果
        >
          返回顶部
        </motion.button>
      )}
    </div>
  );
};
export default CustomLayout;
