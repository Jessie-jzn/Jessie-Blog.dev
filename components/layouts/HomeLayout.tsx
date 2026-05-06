import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative w-full bg-canvas dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Navbar isFull={true} currentTheme="dark" />
      <main>{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomeLayout;
