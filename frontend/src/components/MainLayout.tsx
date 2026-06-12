import React from 'react';
import { Sidebar } from './Sidebar';

interface Props {
  children: React.ReactNode;
}

export const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-clarity-bg">
      <Sidebar />
      <main className="flex-1 overflow-auto p-10">
        {children}
      </main>
    </div>
  );
};
