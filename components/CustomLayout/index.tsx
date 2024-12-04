import { FC } from "react";
import Header from "./Header";
import Footer from "../Footer";
import BackToTop from "../BackToTop";

interface LayoutProps {
  children: React.ReactNode;
}

const CustomLayout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div className="relative w-full bg-[#f7f7f7] dark:bg-gray-950">
      <header>
        <Header btnColor="#d3d58c" />
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default CustomLayout;
