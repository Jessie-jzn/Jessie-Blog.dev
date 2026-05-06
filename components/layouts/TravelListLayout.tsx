import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TravelListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative w-full bg-canvas dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Navbar isFull={true} currentTheme="dark" />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
