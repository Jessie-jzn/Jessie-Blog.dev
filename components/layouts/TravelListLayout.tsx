import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TravelListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen relative w-full bg-white dark:bg-gray-950">
      <Navbar isFull={true} />
      <main className="w-full">{children}</main>
      <Footer className="bg-yellow-50" />
    </div>
  );
}
