import React from 'react';
import { Home, Calendar, Megaphone, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'calendar', icon: Calendar, label: 'Agenda' },
    { id: 'announcements', icon: Megaphone, label: 'Infos' },
    { id: 'profile', icon: User, label: 'Compte' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="max-w-md mx-auto relative">
        <div className="absolute inset-0 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl border-t border-white/20 dark:border-white/5" />
        
        <div className="relative flex justify-around items-center h-[88px] pb-4 px-2">
          {tabs.map((tab) => {
            const isActive = currentTab === tab.id;
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="relative flex flex-col items-center justify-center w-16 h-full gap-1 group"
              >
                <div className={`
                  p-2 rounded-xl transition-all duration-300
                  ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}
                `}>
                  <Icon 
                    size={26} 
                    strokeWidth={isActive ? 2.5 : 2}
                    className="transition-transform duration-200 group-active:scale-90" 
                  />
                </div>
                {isActive && (
                    <motion.div 
                        layoutId="nav-indicator"
                        className="absolute bottom-2 w-1 h-1 rounded-full bg-primary"
                    />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
