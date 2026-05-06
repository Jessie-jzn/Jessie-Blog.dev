import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative w-full bg-canvas dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Navbar isFull={false} />
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-5 pt-20 xs:pt-14 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
