import { FC } from "react";
import Header from "@/components/Header";
import Footer from "@/components/CustomLayout/Footer";

interface LayoutProps {
  children: React.ReactNode;
}
const CustomLayout: FC<LayoutProps> = ({ children }: LayoutProps) => {
  return (
    <div className="relative w-full bg-[#bec088] dark:bg-gray-950">
      {/* Header */}
      <header className="p-6">
        <Header btnColor="#d3d58c" />
      </header>
      <main className="mb-auto">{children}</main>
      <Footer />
    </div>
  );
};
export default CustomLayout;
