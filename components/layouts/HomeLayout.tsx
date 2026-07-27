import Navbar from "@/components/Navbar";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-canvas text-ink">
      <Navbar />
      <main className="flex-grow pt-16 pb-20 xs:pt-14 md:pb-24">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default HomeLayout;
