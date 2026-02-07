import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Book,
  ClipboardCheck,
  GraduationCap,
  Calendar,
  MessageSquare,
  Shield,
  Menu,
  X,
  School,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAppData } from '../hooks/useAppData';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/students', icon: Users, label: 'Students' },
  { to: '/subjects', icon: Book, label: 'Subjects' },
  { to: '/attendance', icon: ClipboardCheck, label: 'Attendance' },
  { to: '/grades', icon: GraduationCap, label: 'Grades' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/communication', icon: MessageSquare, label: 'Communication' },
  { to: '/admin', icon: Shield, label: 'Administrative Panel' },
];

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userProfile, setUserProfile, setIsSettingsOpen, logout, currentUser } = useAppData();

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);

  useEffect(() => {
    setEditedName(userProfile.name);
  }, [userProfile.name]);

  const handleNameSave = () => {
    if (editedName.trim()) {
      setUserProfile(prev => ({ ...prev, name: editedName.trim() }));
    } else {
      setEditedName(userProfile.name);
    }
    setIsEditingName(false);
  };
  
  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameSave();
    } else if (e.key === 'Escape') {
      setIsEditingName(false);
      setEditedName(userProfile.name);
    }
  };

  const NavItem: React.FC<{ to: string, icon: React.ElementType, label: string }> = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
          isActive
            ? 'bg-primary-600 text-white'
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`
      }
      onClick={() => setIsOpen(false)}
    >
      <Icon className="w-5 h-5 mr-3" />
      <span className="truncate">{label}</span>
    </NavLink>
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center text-primary-600 dark:text-primary-400">
          <School className="w-8 h-8 mr-2" />
          <span className="text-xl font-bold">EduPro</span>
        </div>
        <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
            aria-label="Close menu"
        >
            <X size={20} />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          if (item.to === '/admin' && currentUser?.role !== 'admin') {
            return null;
          }
          return <NavItem key={item.to} {...item} />;
        })}
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center min-w-0">
            <div className="relative w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                {userProfile.photoUrl ? (
                    <img src={userProfile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <User className="w-6 h-6" />
                    </div>
                )}
            </div>
            <div className="ml-3 overflow-hidden">
                {isEditingName ? (
                    <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onBlur={handleNameSave}
                        onKeyDown={handleNameKeyDown}
                        autoFocus
                        className="text-sm font-semibold bg-transparent border-b border-primary-500 outline-none p-0 w-full text-gray-800 dark:text-white"
                    />
                ) : (
                    <p 
                        className="text-sm font-semibold text-gray-800 dark:text-white truncate cursor-pointer hover:underline"
                        title="Click to edit name"
                        onClick={() => {
                            setEditedName(userProfile.name);
                            setIsEditingName(true);
                        }}
                    >
                        {userProfile.name}
                    </p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role === 'admin' ? 'User' : currentUser?.role}</p>
            </div>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 ml-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 flex-shrink-0"
            title="Open Settings"
            aria-label="Open Settings"
          >
            <Settings size={20} />
          </button>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
  
  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed top-4 left-4 z-20 p-2 bg-white dark:bg-gray-900 rounded-full shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 transform md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
          {sidebarContent}
      </div>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-20 md:hidden" onClick={() => setIsOpen(false)}></div>}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-64">
        {sidebarContent}
      </div>
    </>
  );
};

export default Sidebar;