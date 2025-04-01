import { ReactNode, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import FloatingActionButton from '@/components/layout/FloatingActionButton';

interface LayoutProps {
  children: ReactNode;
}

// Placeholder for the missing useStudyContext hook.  This needs to be implemented separately.
const useStudyContext = () => ({ isDarkMode: false });


const Layout = ({ children }: LayoutProps) => {
  const { isDarkMode } = useStudyContext();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

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