import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Navbar isFull={false} />
      <article className="container mx-auto px-4 prose dark:prose-invert max-w-none">
        {children}
      </article>
      <Footer />
    </div>
  );
}
