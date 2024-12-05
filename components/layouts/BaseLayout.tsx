import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
  headerProps?: any; // 可以传递给Header的props
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;