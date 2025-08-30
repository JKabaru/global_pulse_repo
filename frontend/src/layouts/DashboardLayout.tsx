import React from 'react';
import Sidebar from '../components/navigation/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-deep-void">
      <Sidebar />
      <main className="flex-1 overflow-hidden bg-deep-void">
        <div className="h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;