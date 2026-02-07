
import React from 'react';
import Sidebar from './Sidebar';
import SettingsModal from './SettingsModal';
import Chatbox from './Chatbox';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-transparent text-gray-800 dark:text-gray-200">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {children}
      </main>
      <SettingsModal />
      <Chatbox />
    </div>
  );
};

export default Layout;
