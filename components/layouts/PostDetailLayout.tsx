import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PostDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='min-h-screen bg-canvas text-ink'>
      <Navbar isFull={false} />
      <article className='mx-auto w-full max-w-[46rem] px-4 pb-20 pt-20 sm:px-6 sm:pb-24 sm:pt-24'>
        {children}
      </article>
      <Footer />
    </div>
  );
}
