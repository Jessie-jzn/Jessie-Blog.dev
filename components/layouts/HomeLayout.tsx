/** 组合深色首页导航、页脚和返回顶部按钮的首页页面布局。 */
import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-canvas text-ink">
      <Navbar isFull={true} currentTheme="dark" />
      <main className="flex-grow pt-16 pb-20 xs:pt-14 md:pb-24">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomeLayout;
