import React from 'react';

export interface Student {
  id: string;
  name: string;
  section?: string;
  contact?: {
    email?: string;
    phone?: string;
    guardianName?: string;
  };
}

export interface Subject {
  id: string;
  name:string;
  studentIds: string[];
}

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
}

export interface AttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
}

export interface DailyAttendance {
  date: string; // YYYY-MM-DD
  subjectId: string;
  records: AttendanceRecord[];
}

export interface GradeItem {
  id: string;
  name: string;
  score: number;
  total: number;
  weight: number; // e.g., 0.2 for 20%
}

export interface StudentGrades {
  studentId: string;
  subjectId: string;
  items: GradeItem[];
}

export interface StudentNote {
  id: string;
  studentId: string;
  date: string; // ISO string
  content: string;
}

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
}

export interface AppUser {
  id: string;
  username: string;
  password?: string;
  role: 'admin' | 'teacher';
}

export interface UserProfile {
  name: string;
  photoUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
}

export type FinanceHistoryAction = 'bill_printed' | 'bulk_bills_printed' | 'finance_report_printed';
export interface FinanceHistoryEvent {
  id: string;
  timestamp: string; // ISO string
  action: FinanceHistoryAction;
  details: string;
}

export interface ManualTransaction {
  id: string;
  timestamp: string; // ISO string
  description: string;
  amount: number;
  type: 'incoming' | 'outgoing';
}

export interface AppContextType {
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  attendance: DailyAttendance[];
  setAttendance: React.Dispatch<React.SetStateAction<DailyAttendance[]>>;
  grades: StudentGrades[];
  setGrades: React.Dispatch<React.SetStateAction<StudentGrades[]>>;
  events: CalendarEvent[];
  setEvents: React.Dispatch<React.SetStateAction<CalendarEvent[]>>;
  notes: StudentNote[];
  setNotes: React.Dispatch<React.SetStateAction<StudentNote[]>>;
  appUsers: AppUser[];
  setAppUsers: React.Dispatch<React.SetStateAction<AppUser[]>>;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  isSettingsOpen: boolean;
  setIsSettingsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
  notifications: { email: boolean; push: boolean; };
  setNotifications: React.Dispatch<React.SetStateAction<{ email: boolean; push: boolean; }>>;
  primaryColor: string;
  setPrimaryColor: React.Dispatch<React.SetStateAction<string>>;
  brightness: number;
  setBrightness: React.Dispatch<React.SetStateAction<number>>;
  volume: number;
  setVolume: React.Dispatch<React.SetStateAction<number>>;
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  backgroundColor: string;
  setBackgroundColor: React.Dispatch<React.SetStateAction<string>>;
  currentUser: AppUser | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<AppUser | null>>;
  logout: () => void;
  financeHistory: FinanceHistoryEvent[];
  setFinanceHistory: React.Dispatch<React.SetStateAction<FinanceHistoryEvent[]>>;
  addFinanceHistory: (action: FinanceHistoryAction, details: string) => void;
  manualTransactions: ManualTransaction[];
  setManualTransactions: React.Dispatch<React.SetStateAction<ManualTransaction[]>>;
}