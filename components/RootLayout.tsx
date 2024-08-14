import { FC } from "react";
// import Header from "./Header";
import Footer from "./Footer";
import dynamic from "next/dynamic";

const Header = dynamic(() => import("./Header"), {
  ssr: true,
});
interface LayoutProps {
  children: React.ReactNode;
  handleSubscribe: any;
}
const RootLayout: FC<LayoutProps> = ({
  children,
  handleSubscribe,
}: LayoutProps) => {
  return (
    <div className="w-full flex relative bg-white pl-[calc(100vw-100%)] text-black antialiased dark:bg-gray-950 dark:text-white">
      <section className="mx-auto px-4 sm:px-6 w-5/6">
        {/* <div className="flex h-screen flex-col justify-between font-sans"> */}
        <Header />
        <main className="mb-auto">{children}</main>
        <Footer handleSubscribe={handleSubscribe} />
        {/* </div> */}
      </section>
    </div>
  );
};

export default RootLayout;
