import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Book, ClipboardCheck, GraduationCap, Calendar, MessageSquare, Camera, User, Edit } from 'lucide-react';
import { useAppData } from '../hooks/useAppData';
// FIX: Import 'format' from its specific sub-package in date-fns.
import format from 'date-fns/format';

const Dashboard: React.FC = () => {
  const { students, subjects, events, userProfile, setUserProfile } = useAppData();
  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingEvents = events.filter(e => e.date >= today).slice(0, 3);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for editing user name
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(userProfile.name);

  // Sync local name state with context
  useEffect(() => {
    setEditedName(userProfile.name);
  }, [userProfile.name]);

  const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: string }> = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full mr-4 ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{value}</p>
      </div>
    </div>
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserProfile(prev => ({ ...prev, photoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Handlers for name editing
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
      setEditedName(userProfile.name); // Revert on escape
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
            {isEditingName ? (
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">Welcome,&nbsp;</span>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleNameKeyDown}
                  autoFocus
                  className="text-3xl font-bold bg-transparent border-b-2 border-primary-500 outline-none text-gray-900 dark:text-white w-auto"
                />
                 <span className="text-3xl font-bold text-gray-900 dark:text-white">!</span>
              </div>
            ) : (
              <h1
                onClick={() => {
                  setEditedName(userProfile.name);
                  setIsEditingName(true);
                }}
                className="text-3xl font-bold text-gray-900 dark:text-white group cursor-pointer inline-flex items-center"
                title="Click to edit name"
              >
                Welcome, {userProfile.name}!
                <Edit className="w-6 h-6 ml-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h1>
            )}
            <p className="text-gray-600 dark:text-gray-400 mt-1">Here's a snapshot of your day.</p>
        </div>
        
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center">
            <div 
                className="relative w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden cursor-pointer shadow-lg group"
                onClick={triggerFileInput}
            >
                {userProfile.photoUrl ? (
                    <img src={userProfile.photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-400">
                        <User className="w-10 h-10" />
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <Camera className="w-6 h-6 text-white" />
                </div>
            </div>
            <span className="text-xs text-primary-600 dark:text-primary-400 mt-1 cursor-pointer hover:underline" onClick={triggerFileInput}>
                Change Photo
            </span>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
            />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Users} title="Total Students" value={students.length} color="bg-primary-500" />
        <StatCard icon={Book} title="Active Subjects" value={subjects.length} color="bg-green-500" />
        <StatCard icon={Calendar} title="Upcoming Events" value={upcomingEvents.length} color="bg-purple-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/attendance" className="flex items-center justify-center p-4 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/50 dark:hover:bg-primary-900/80 rounded-lg text-primary-600 dark:text-primary-300 transition-colors">
              <ClipboardCheck className="w-6 h-6 mr-2" />
              <span>Take Attendance</span>
            </Link>
            <Link to="/grades" className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/50 dark:hover:bg-green-900/80 rounded-lg text-green-600 dark:text-green-300 transition-colors">
              <GraduationCap className="w-6 h-6 mr-2" />
              <span>Enter Grades</span>
            </Link>
            <Link to="/calendar" className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/50 dark:hover:bg-purple-900/80 rounded-lg text-purple-600 dark:text-purple-300 transition-colors">
              <Calendar className="w-6 h-6 mr-2" />
              <span>View Calendar</span>
            </Link>
            <Link to="/communication" className="flex items-center justify-center p-4 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-900/50 dark:hover:bg-yellow-900/80 rounded-lg text-yellow-600 dark:text-yellow-300 transition-colors">
              <MessageSquare className="w-6 h-6 mr-2" />
              <span>Send Message</span>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Schedule</h2>
          {upcomingEvents.length > 0 ? (
            <ul className="space-y-3">
              {upcomingEvents.map(event => (
                <li key={event.id} className="flex items-start">
                  <div className="w-16 text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {format(new Date(event.date.replace(/-/g, '/')), 'MMM d')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{event.title}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{event.description}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming events on your calendar.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;