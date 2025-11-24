
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Theme } from '../types';

interface AppContextType {
  user: User | null;
  login: (matricule: string) => void;
  logout: () => void;
  theme: Theme;
  toggleTheme: () => void;
  notifications: number;
  clearNotifications: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DUMMY_USER: User = {
  id: 'u1',
  matricule: '2025-XYZ-001',
  firstName: 'Alexandre',
  lastName: 'Dupont',
  fullName: 'Alexandre Dupont',
  bio: 'Passionné par le développement web et l’IA.',
  avatarUrl: 'https://picsum.photos/seed/alex/200',
  level: 'Master 1',
  major: 'Informatique',
  option: 'Génie Logiciel',
  isClassRep: true,
  gpa: 16.5,
  rank: '3ème',
};

export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<Theme>('light'); // Default state is light
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    // Check only stored preference. If none, keep default 'light'.
    // Removed system preference check to ensure default is always white.
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const login = (matricule: string) => {
    // Simulate login
    setTimeout(() => {
        setUser(DUMMY_USER);
    }, 500);
  };

  const logout = () => {
    setUser(null);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const clearNotifications = () => setNotifications(0);

  return (
    <AppContext.Provider value={{ user, login, logout, theme, toggleTheme, notifications, clearNotifications }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
