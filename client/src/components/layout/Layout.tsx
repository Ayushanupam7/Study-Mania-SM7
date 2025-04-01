import { ReactNode } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import FloatingActionButton from '@/components/layout/FloatingActionButton';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background">
        <Header />
        <div className="p-6 max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      <FloatingActionButton />
    </div>
  );
};

export default Layout;
