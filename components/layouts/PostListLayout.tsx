import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-canvas text-ink">
      <Navbar />
      <main className="site-container flex-grow pt-16 pb-20 xs:pt-14 md:pb-24">
        {children}
      </main>
      <Footer />
    </div>
  );
}
