import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface BackToTopProps {
  threshold?: number;
  className?: string;
  buttonText?: string;
}

const BackToTop = ({ 
  threshold = 200, 
  className = "fixed bottom-8 right-8 bg-[#bec088] text-white p-4 rounded-full shadow-lg hover:bg-[#bec088] transition duration-300",
  buttonText = "返回顶部"
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