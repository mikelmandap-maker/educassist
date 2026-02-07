import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { 
    Student, Subject, DailyAttendance, StudentGrades, CalendarEvent, StudentNote, AttendanceStatus, AppUser, 
    UserProfile, AppContextType, ChatMessage, FinanceHistoryEvent, FinanceHistoryAction, ManualTransaction
} from '../types';
// FIX: Import 'format' from its specific sub-package in date-fns.
import format from 'date-fns/format';

const COLORS: Record<string, { h: string, s: string }> = {
  blue: { h: '221.2', s: '83.2%' },
  green: { h: '145.1', s: '63.2%' },
  purple: { h: '262.1', s: '83.3%' },
  pink: { h: '346.8', s: '77.2%' },
};

// MOCK DATA
const mockStudents: Student[] = [
  { id: 's1', name: 'Alice Johnson', section: 'Grade 10-A', contact: { guardianName: 'Maria Johnson', email: 'maria.j@example.com' } },
  { id: 's2', name: 'Bob Williams', section: 'Grade 10-B', contact: { guardianName: 'David Williams', phone: '555-1234' } },
  { id: 's3', name: 'Charlie Brown', section: 'Grade 10-A', contact: { guardianName: 'Sarah Brown', email: 'sarah.b@example.com' } },
  { id: 's4', name: 'Diana Miller', section: 'Grade 11-A', contact: { guardianName: 'Paul Miller' } },
];

const mockSubjects: Subject[] = [
  { id: 'sub1', name: 'Mathematics', studentIds: ['s1', 's2', 's3', 's4'] },
  { id: 'sub2', name: 'History', studentIds: ['s1', 's3'] },
  { id: 'sub3', name: 'Science', studentIds: ['s2', 's4'] },
];

const mockAttendance: DailyAttendance[] = [
    { date: format(new Date(), 'yyyy-MM-dd'), subjectId: 'sub1', records: [
        { studentId: 's1', status: AttendanceStatus.Present },
        { studentId: 's2', status: AttendanceStatus.Present },
        { studentId: 's3', status: AttendanceStatus.Absent },
        { studentId: 's4', status: AttendanceStatus.Late },
    ]}
];

const mockGrades: StudentGrades[] = [
    { studentId: 's1', subjectId: 'sub1', items: [
        { id: 'g1', name: 'Algebra Quiz', score: 85, total: 100, weight: 0.4 },
        { id: 'g2', name: 'Geometry Homework', score: 95, total: 100, weight: 0.6 },
    ]},
    { studentId: 's2', subjectId: 'sub1', items: [
        { id: 'g3', name: 'Algebra Quiz', score: 72, total: 100, weight: 0.4 },
        { id: 'g4', name: 'Geometry Homework', score: 80, total: 100, weight: 0.6 },
    ]},
    { studentId: 's3', subjectId: 'sub1', items: [
        { id: 'g5', name: 'Algebra Quiz', score: 65, total: 100, weight: 0.4 },
    ]},
];

const mockEvents: CalendarEvent[] = [
    { id: 'e1', date: format(new Date(), 'yyyy-MM-dd'), title: 'Math Quiz', description: 'Chapter 5: Algebra' },
    { id: 'e2', date: format(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'), title: 'History Project Due', description: 'Roman Empire Presentation' },
];

const mockNotes: StudentNote[] = [
    { id: 'n1', studentId: 's3', date: new Date().toISOString(), content: 'Struggling with fractions, needs extra practice.' },
    { id: 'n2', studentId: 's1', date: new Date().toISOString(), content: 'Excellent participation in class discussions this week.'}
];

const mockAppUsers: AppUser[] = [
    { id: 'u1', username: 'teacher1', password: 'password123', role: 'teacher' },
    { id: 'u2', username: 'admin', password: 'admin123', role: 'admin' },
];

const mockChatMessages: ChatMessage[] = [
    { id: 'msg1', sender: 'Dr. Evelyn Reed', text: "Hey! Just wanted to check if you've finalized the grades for the science fair project.", timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
    { id: 'msg2', sender: 'You', text: "Hi Evelyn, almost done. Just reviewing the last few submissions now. Should be ready by EOD.", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
];

const mockFinanceHistory: FinanceHistoryEvent[] = [];
const mockManualTransactions: ManualTransaction[] = [];


export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const loadAppData = () => {
    try {
      const storedData = localStorage.getItem('eduProAppData');
      return storedData ? JSON.parse(storedData) : {};
    } catch {
      return {};
    }
  };
  const persistedData = loadAppData();
  
  const [students, setStudents] = useState<Student[]>(persistedData.students || mockStudents);
  const [subjects, setSubjects] = useState<Subject[]>(persistedData.subjects || mockSubjects);
  const [attendance, setAttendance] = useState<DailyAttendance[]>(persistedData.attendance || mockAttendance);
  const [grades, setGrades] = useState<StudentGrades[]>(persistedData.grades || mockGrades);
  const [events, setEvents] = useState<CalendarEvent[]>(persistedData.events || mockEvents);
  const [notes, setNotes] = useState<StudentNote[]>(persistedData.notes || mockNotes);
  const [appUsers, setAppUsers] = useState<AppUser[]>(persistedData.appUsers || mockAppUsers);
  const [userProfile, setUserProfile] = useState<UserProfile>(persistedData.userProfile || { name: 'Teacher', photoUrl: undefined });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(mockChatMessages);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [financeHistory, setFinanceHistory] = useState<FinanceHistoryEvent[]>(persistedData.financeHistory || mockFinanceHistory);
  const [manualTransactions, setManualTransactions] = useState<ManualTransaction[]>(persistedData.manualTransactions || mockManualTransactions);
  
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);

  // Global settings state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'system');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || 'blue');
  const [brightness, setBrightness] = useState(() => parseInt(localStorage.getItem('brightness') || '100', 10));
  const [volume, setVolume] = useState(() => parseInt(localStorage.getItem('volume') || '100', 10));
  const [backgroundColor, setBackgroundColor] = useState(() => localStorage.getItem('backgroundColor') || '');

  const [notifications, setNotifications] = useState<{ email: boolean; push: boolean; }>(() => {
    try {
        const stored = localStorage.getItem('notifications');
        return stored ? JSON.parse(stored) : { email: true, push: false };
    } catch {
        return { email: true, push: false };
    }
  });

  const addFinanceHistory = (action: FinanceHistoryAction, details: string) => {
    const newEvent: FinanceHistoryEvent = {
      id: `fh${Date.now()}`,
      timestamp: new Date().toISOString(),
      action,
      details,
    };
    setFinanceHistory(prev => [newEvent, ...prev]);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  useEffect(() => {
    const saveDataOnClose = () => {
        try {
            const appData = {
                students,
                subjects,
                attendance,
                grades,
                events,
                notes,
                appUsers,
                userProfile,
                financeHistory,
                manualTransactions,
            };
            localStorage.setItem('eduProAppData', JSON.stringify(appData));
        } catch (error) {
            console.error('Failed to save app data to localStorage', error);
        }
    };

    window.addEventListener('beforeunload', saveDataOnClose);

    return () => {
        window.removeEventListener('beforeunload', saveDataOnClose);
    };
  }, [
      students,
      subjects,
      attendance,
      grades,
      events,
      notes,
      appUsers,
      userProfile,
      financeHistory,
      manualTransactions,
  ]);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  useEffect(() => {
    const color = COLORS[primaryColor] || COLORS.blue;
    const root = window.document.documentElement;
    root.style.setProperty('--primary-hue', color.h);
    root.style.setProperty('--primary-saturation', color.s);
    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.style.setProperty('--filter-brightness', `${brightness}%`);
    localStorage.setItem('brightness', brightness.toString());
  }, [brightness]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
      const body = document.body;
      
      body.style.backgroundImage = '';
      localStorage.removeItem('backgroundImage');

      if (backgroundColor) {
          body.style.backgroundColor = backgroundColor;
          body.classList.remove('bg-gray-50', 'dark:bg-gray-900');
          localStorage.setItem('backgroundColor', backgroundColor);
      } else {
          body.style.backgroundColor = '';
          body.classList.add('bg-gray-50', 'dark:bg-gray-900');
          localStorage.removeItem('backgroundColor');
      }
  }, [backgroundColor, theme]);

  return (
    <AppContext.Provider value={{ 
        students, setStudents, 
        subjects, setSubjects, 
        attendance, setAttendance, 
        grades, setGrades, 
        events, setEvents, 
        notes, setNotes,
        appUsers, setAppUsers,
        userProfile, setUserProfile,
        isSettingsOpen, setIsSettingsOpen,
        theme, setTheme,
        notifications, setNotifications,
        primaryColor, setPrimaryColor,
        brightness, setBrightness,
        volume, setVolume,
        isChatOpen, setIsChatOpen,
        chatMessages, setChatMessages,
        backgroundColor, setBackgroundColor,
        currentUser, setCurrentUser,
        logout,
        financeHistory, setFinanceHistory,
        addFinanceHistory,
        manualTransactions, setManualTransactions,
    }}>
      {children}
    </AppContext.Provider>
  );
};