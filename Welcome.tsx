
import React, { useState, useEffect } from 'react';
import { School } from 'lucide-react';

interface WelcomeProps {
  onFinish: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onFinish }) => {
  const messages = [
    "Initializing your classroom...",
    "Organizing your schedule...",
    "Preparing your tools...",
    "Welcome to EduPro!",
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [fade, setFade] = useState('opacity-0');

  useEffect(() => {
    setFade('opacity-100');
    const interval = setInterval(() => {
      setFade('opacity-0');
      setTimeout(() => {
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(prev => prev + 1);
          setFade('opacity-100');
        } else {
          clearInterval(interval);
          setTimeout(onFinish, 1000);
        }
      }, 500); // fade out duration
    }, 2000); // message display duration

    return () => clearInterval(interval);
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMessageIndex]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="flex items-center text-primary-600 dark:text-primary-400 mb-6">
        <School className="w-16 h-16 mr-4" />
        <h1 className="text-5xl font-bold">EduPro</h1>
      </div>
      <p className={`text-xl text-gray-600 dark:text-gray-400 transition-opacity duration-500 ${fade}`}>
        {messages[currentMessageIndex]}
      </p>
    </div>
  );
};

export default Welcome;
