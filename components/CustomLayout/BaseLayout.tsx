import React from 'react';
import Header from './Header';
import Footer from '../Footer';

interface BaseLayoutProps {
  children: React.ReactNode;
  headerProps?: any; // 可以传递给Header的props
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, headerProps }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header {...headerProps} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default BaseLayout;