import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative w-full bg-white dark:bg-gray-950">
      <Navbar isFull={false} />
      <main className="container mx-auto px-4 xs:px-0 pb-20">{children}</main>
      <Footer />
    </div>
  );
}
