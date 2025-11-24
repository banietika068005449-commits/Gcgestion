
import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import BottomNav from './components/BottomNav';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import SettingsScreen from './screens/SettingsScreen';
import GradesScreen from './screens/GradesScreen';
import CalendarScreen from './screens/CalendarScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const { user } = useApp();
  const [currentTab, setCurrentTab] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGradesOpen, setIsGradesOpen] = useState(false);

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'home':
        return (
            <HomeScreen 
                onOpenChat={() => setIsChatOpen(true)} 
                onOpenSettings={() => setIsSettingsOpen(true)} 
                onOpenGrades={() => setIsGradesOpen(true)}
                onOpenCalendar={() => setCurrentTab('calendar')}
                onOpenAnnouncements={() => setCurrentTab('announcements')}
            />
        );
      case 'calendar':
        return <CalendarScreen />;
      case 'announcements':
         return <AnnouncementsScreen />;
      case 'profile':
         // For simplicity, profile tab redirects to settings or shows profile details
         // Here we just keep user on the same screen or show settings
         if (!isSettingsOpen) setIsSettingsOpen(true);
         return null;
      default:
        return (
            <HomeScreen 
                onOpenChat={() => setIsChatOpen(true)} 
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenGrades={() => setIsGradesOpen(true)}
                onOpenCalendar={() => setCurrentTab('calendar')}
                onOpenAnnouncements={() => setCurrentTab('announcements')}
            />
        );
    }
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark transition-colors duration-300">
      
      {/* Main Content Area */}
      <main className="min-h-screen pb-24">
         <AnimatePresence mode="wait">
             <motion.div
                key={currentTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="min-h-screen"
             >
                {renderContent()}
             </motion.div>
         </AnimatePresence>
      </main>

      {/* Navigation */}
      <BottomNav 
        currentTab={currentTab} 
        onTabChange={(tab) => {
            if (tab === 'profile') {
                setIsSettingsOpen(true);
            } else {
                setCurrentTab(tab);
            }
        }} 
      />

      {/* Modals/Drawers */}
      <AnimatePresence>
        {isChatOpen && <ChatScreen key="chat" onClose={() => setIsChatOpen(false)} />}
        {isSettingsOpen && <SettingsScreen key="settings" onBack={() => setIsSettingsOpen(false)} />}
        {isGradesOpen && <GradesScreen key="grades" onBack={() => setIsGradesOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;
