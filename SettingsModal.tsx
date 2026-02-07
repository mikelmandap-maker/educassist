import React from 'react';
import { useAppData } from '../hooks/useAppData';
import ToggleSwitch from './ToggleSwitch';
import { X, Sun, Moon, Monitor, Settings as SettingsIcon, Check, Volume1, Volume2 } from 'lucide-react';

const colorOptions = [
    { name: 'blue', color: 'bg-blue-500' },
    { name: 'green', color: 'bg-green-500' },
    { name: 'purple', color: 'bg-purple-500' },
    { name: 'pink', color: 'bg-pink-500' },
];

const backgroundColors = [
    { name: 'Default', value: '' },
    { name: 'Slate', value: '#f1f5f9', darkValue: '#1e293b' },
    { name: 'Sky', value: '#f0f9ff', darkValue: '#0c4a6e' },
    { name: 'Teal', value: '#f0fdfa', darkValue: '#134e4a' },
];

const SettingsModal: React.FC = () => {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    theme, 
    setTheme, 
    notifications, 
    setNotifications,
    primaryColor,
    setPrimaryColor,
    brightness,
    setBrightness,
    volume,
    setVolume,
    backgroundColor,
    setBackgroundColor,
  } = useAppData();
  const isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  if (!isSettingsOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center">
                <SettingsIcon className="mr-3"/>Application Settings
            </h2>
            <button onClick={() => setIsSettingsOpen(false)} className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Close settings">
                <X size={24} />
            </button>
        </div>

        <div className="space-y-6">
            {/* Theme */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Theme</label>
                <div className="flex gap-2 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                    <button onClick={() => setTheme('light')} className={`w-full p-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${theme === 'light' ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><Sun size={14}/> Light</button>
                    <button onClick={() => setTheme('dark')} className={`w-full p-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${theme === 'dark' ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><Moon size={14}/> Dark</button>
                    <button onClick={() => setTheme('system')} className={`w-full p-2 text-sm rounded-md flex items-center justify-center gap-2 transition-colors ${theme === 'system' ? 'bg-white dark:bg-gray-800 shadow' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}><Monitor size={14}/> System</button>
                </div>
            </div>
            {/* Accent Color */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Accent Color</label>
                <div className="flex gap-3">
                    {colorOptions.map(opt => (
                        <button key={opt.name} onClick={() => setPrimaryColor(opt.name)} className={`w-8 h-8 rounded-full ${opt.color} flex items-center justify-center`}>
                           {primaryColor === opt.name && <Check className="w-5 h-5 text-white" />}
                        </button>
                    ))}
                </div>
            </div>
            {/* Brightness */}
            <div>
                <label htmlFor="brightness-slider" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Brightness ({brightness}%)</label>
                <input
                    id="brightness-slider"
                    type="range"
                    min="50"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
            </div>
            {/* Volume */}
            <div>
                <label htmlFor="volume-slider" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Volume ({volume}%)</label>
                 <div className="flex items-center gap-3">
                    <Volume1 size={20} className="text-gray-400" />
                    <input
                        id="volume-slider"
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => setVolume(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <Volume2 size={20} className="text-gray-400" />
                </div>
            </div>
             {/* Background */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Background</label>
                <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                    <div>
                        <h4 className="text-xs font-semibold mb-2 text-gray-600 dark:text-gray-400">Solid Color</h4>
                        <div className="flex gap-3">
                           {backgroundColors.map(opt => {
                                const colorVal = isDark ? (opt.darkValue || opt.value) : opt.value;
                                return (
                                    <button 
                                        key={opt.name} 
                                        onClick={() => setBackgroundColor(colorVal)} 
                                        className="w-8 h-8 rounded-full border dark:border-gray-500 flex items-center justify-center"
                                        style={{ backgroundColor: colorVal || (isDark ? '#111827' : '#f9fafb') }}
                                        title={opt.name}
                                    >
                                        {backgroundColor === colorVal && <Check className={`w-5 h-5 ${isDark ? 'text-white' : 'text-black'}`} />}
                                    </button>
                                );
                           })}
                        </div>
                    </div>
                </div>
            </div>
            {/* Notifications */}
            <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Notifications</label>
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                    <div className="flex justify-between items-center"><span className="text-sm">Email Notifications</span><ToggleSwitch checked={notifications.email} onChange={() => setNotifications(p => ({...p, email: !p.email}))} /></div>
                    <div className="flex justify-between items-center"><span className="text-sm">Push Notifications</span><ToggleSwitch checked={notifications.push} onChange={() => setNotifications(p => ({...p, push: !p.push}))} /></div>
                </div>
            </div>
        </div>
        
      </div>
    </div>
  );
};

export default SettingsModal;