import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface AppShellProps {
  children: React.ReactNode;
  hideFooter?: boolean;
  className?: string;
}

export const AppShell: React.FC<AppShellProps> = ({ 
  children, 
  hideFooter = false, 
  className = "min-h-screen flex flex-col bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-150" 
}) => {
  return (
    <div className={className}>
      <Navbar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
