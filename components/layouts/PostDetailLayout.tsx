import Header from '../CustomLayout/Header';
import Footer from '../Footer';

export default function PostDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <Header />
      <article className="container mx-auto px-4 prose dark:prose-invert max-w-none">
        {children}
      </article>
      <Footer />
    </div>
  );
} 