import Header from '@/components/Navbar';
import BackToTop from '@/components/BackToTop';
import Footer from './Footer';

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen relative w-full bg-[#f7f7f7] dark:bg-gray-950">
      <Header className='bg-[#bec088]'/>
      <main>{children}</main>
      <Footer />
      <BackToTop />

    </div>
  );
} 