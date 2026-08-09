/** 根据滚动阈值显示平滑返回页面顶部的浮动按钮。 */
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
  buttonText?: string;
}

const BackToTop = ({
  threshold = 200,
  className = "editorial-focus fixed bottom-8 right-8 inline-flex min-h-10 items-center justify-center rounded-full border border-line bg-primary px-4 text-sm font-medium text-ink transition-colors hover:bg-primaryStrong hover:text-surface",
  buttonText = "返回顶部",
}: BackToTopProps) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  if (!showScrollToTop) return null;

  return (
    <motion.button
      onClick={scrollToTop}
      className={className}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {buttonText}
    </motion.button>
  );
};

export default BackToTop;
