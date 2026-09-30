/** 组合首页导航、页脚和返回顶部按钮。 */
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-canvas text-ink">
      <Navbar />
      <div className="flex-grow pt-14 sm:pt-16">{children}</div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomeLayout;
