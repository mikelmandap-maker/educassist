
import { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { AppContextType } from '../types';

export const useAppData = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppProvider');
  }
  return context;
};
