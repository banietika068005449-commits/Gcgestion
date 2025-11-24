
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, MapPin, User, Calendar as CalendarIcon, MoreVertical, BookOpen, Download, Check } from 'lucide-react';

type CourseType = 'CM' | 'TD' | 'TP' | 'EXAMEN';

interface Course {
  id: string;
  title: string;
  type: CourseType;
  startTime: string;
  endTime: string;
  room: string;
  professor: string;
  color: string; // Tailwind class for border/bg accents
}

interface DaySchedule {
  day: string;
  date: string; // "12"
  fullDate: string; // "Lundi 12 Octobre"
  courses: Course[];
}

const SCHEDULE_DATA: DaySchedule[] = [
  {
    day: 'Lun',
    date: '14',
    fullDate: 'Lundi 14 Octobre',
    courses: [
      {
        id: '1',
        title: 'Algorithmique Avancée',
        type: 'CM',
        startTime: '08:30',
        endTime: '10:30',
        room: 'Amphi A',
        professor: 'Dr. Martin',
        color: 'blue'
      },
      {
        id: '2',
        title: 'Algorithmique Avancée',
        type: 'TD',
        startTime: '10:45',
        endTime: '12:15',
        room: 'Salle 204',
        professor: 'M. Dubois',
        color: 'orange'
      },
      {
        id: '3',
        title: 'Anglais Technique',
        type: 'TD',
        startTime: '14:00',
        endTime: '16:00',
        room: 'Labo Langues',
        professor: 'Mme. Smith',
        color: 'green'
      }
    ]
  },
  {
    day: 'Mar',
    date: '15',
    fullDate: 'Mardi 15 Octobre',
    courses: [
      {
        id: '4',
        title: 'Base de Données SQL',
        type: 'CM',
        startTime: '09:00',
        endTime: '12:00',
        room: 'Amphi B',
        professor: 'Pr. Leroy',
        color: 'purple'
      },
      {
        id: '5',
        title: 'Projet Web',
        type: 'TP',
        startTime: '13:30',
        endTime: '17:30',
        room: 'Salle info 3',
        professor: 'M. Chen',
        color: 'pink'
      }
    ]
  },
  {
    day: 'Mer',
    date: '16',
    fullDate: 'Mercredi 16 Octobre',
    courses: [] // Jour off
  },
  {
    day: 'Jeu',
    date: '17',
    fullDate: 'Jeudi 17 Octobre',
    courses: [
      {
        id: '6',
        title: 'Droit du Numérique',
        type: 'CM',
        startTime: '08:30',
        endTime: '10:30',
        room: 'Amphi C',
        professor: 'Mme. Bernard',
        color: 'indigo'
      },
      {
        id: '7',
        title: 'Mathématiques',
        type: 'TD',
        startTime: '10:45',
        endTime: '12:45',
        room: 'Salle 102',
        professor: 'Dr. Klein',
        color: 'red'
      }
    ]
  },
  {
    day: 'Ven',
    date: '18',
    fullDate: 'Vendredi 18 Octobre',
    courses: [
      {
        id: '8',
        title: 'Architecture Web',
        type: 'CM',
        startTime: '14:00',
        endTime: '17:00',
        room: 'Visio-conférence',
        professor: 'M. Alami',
        color: 'cyan'
      }
    ]
  }
];

const getTypeColor = (type: CourseType, variant: 'bg' | 'text' | 'border') => {
  const colors = {
    CM: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
    TD: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
    TP: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
    EXAMEN: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-800' },
  };
  return colors[type][variant];
};

const CalendarScreen: React.FC = () => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(0); // Default to Monday
  const [isExporting, setIsExporting] = useState(false);
  const currentSchedule = SCHEDULE_DATA[selectedDayIndex];

  // Fonction pour générer le fichier ICS
  const handleExportCalendar = () => {
    setIsExporting(true);

    // En-tête du fichier iCalendar
    let icsContent = 
`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Intranet Etudiant//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Emploi du temps - Univ XYZ
X-WR-TIMEZONE:Europe/Paris
`;

    // Année et Mois fixes pour la démo (Octobre 2025)
    const YEAR = "2025";
    const MONTH = "10";

    SCHEDULE_DATA.forEach(day => {
        day.courses.forEach(course => {
            // Formatage des dates: YYYYMMDDTHHMMSS
            const startDateTime = `${YEAR}${MONTH}${day.date}T${course.startTime.replace(':', '')}00`;
            const endDateTime = `${YEAR}${MONTH}${day.date}T${course.endTime.replace(':', '')}00`;
            
            icsContent += 
`BEGIN:VEVENT
UID:${course.id}-${startDateTime}@univ-xyz.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;TZID=Europe/Paris:${startDateTime}
DTEND;TZID=Europe/Paris:${endDateTime}
SUMMARY:${course.title} (${course.type})
DESCRIPTION:Professeur: ${course.professor}\\nSalle: ${course.room}
LOCATION:${course.room}
STATUS:CONFIRMED
END:VEVENT
`;
        });
    });

    icsContent += "END:VCALENDAR";

    // Création du blob et téléchargement
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'emploi_du_temps_univ.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Feedback visuel
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="min-h-screen bg-bgLight dark:bg-bgDark pt-20 pb-32 px-4 max-w-md mx-auto">
       {/* Header */}
       <header className="fixed top-0 left-0 right-0 z-30 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 pt-safe-top">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-textMainLight dark:text-textMainDark">Emploi du temps</h1>
          
          <button 
            onClick={handleExportCalendar}
            disabled={isExporting}
            className="flex items-center gap-2 text-sm font-medium text-primary bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors active:scale-95"
          >
             {isExporting ? <Check size={16} /> : <Download size={16} />}
             <span>{isExporting ? 'Ajouté' : 'Sync'}</span>
          </button>
        </div>
        
        {/* Horizontal Day Selector */}
        <div className="max-w-md mx-auto px-2 pb-3 overflow-x-auto no-scrollbar flex gap-2">
            {SCHEDULE_DATA.map((dayData, index) => {
                const isSelected = index === selectedDayIndex;
                return (
                    <button
                        key={dayData.date}
                        onClick={() => setSelectedDayIndex(index)}
                        className={`flex flex-col items-center justify-center min-w-[60px] h-[70px] rounded-2xl transition-all duration-300 border ${
                            isSelected 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30 scale-105' 
                            : 'bg-white dark:bg-surfaceDark border-transparent text-textSecLight dark:text-textSecDark hover:bg-gray-50 dark:hover:bg-white/5'
                        }`}
                    >
                        <span className={`text-xs font-medium ${isSelected ? 'opacity-80' : ''}`}>{dayData.day}</span>
                        <span className="text-lg font-bold">{dayData.date}</span>
                        {dayData.courses.length > 0 && !isSelected && (
                            <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
                        )}
                    </button>
                )
            })}
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-24"></div>

      <div className="mt-4">
          <div className="flex justify-between items-end mb-4 px-2">
            <h2 className="text-lg font-bold text-textMainLight dark:text-textMainDark">
                {currentSchedule.fullDate}
            </h2>
            <span className="text-xs text-textSecLight dark:text-textSecDark bg-gray-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                Semaine 42
            </span>
          </div>

          <div className="space-y-4 relative">
            {/* Vertical Line */}
            <div className="absolute left-[27px] top-2 bottom-0 w-[2px] bg-gray-100 dark:bg-white/5 -z-10"></div>

            <AnimatePresence mode='wait'>
                <motion.div
                    key={selectedDayIndex}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                >
                    {currentSchedule.courses.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 opacity-50">
                            <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                                <BookOpen size={32} className="text-gray-400" />
                            </div>
                            <p className="text-textMainLight dark:text-textMainDark font-medium">Aucun cours prévu</p>
                            <p className="text-sm text-textSecLight dark:text-textSecDark">Profitez de votre journée libre !</p>
                        </div>
                    ) : (
                        currentSchedule.courses.map((course, idx) => (
                            <div key={course.id} className="flex gap-4 group">
                                {/* Time Column */}
                                <div className="flex flex-col items-end w-14 flex-shrink-0 pt-1">
                                    <span className="text-sm font-bold text-textMainLight dark:text-textMainDark">{course.startTime}</span>
                                    <span className="text-xs text-textSecLight dark:text-textSecDark">{course.endTime}</span>
                                </div>

                                {/* Course Card */}
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`flex-1 bg-white dark:bg-surfaceDark rounded-2xl p-4 shadow-sm border-l-4 border border-gray-50 dark:border-white/5 relative overflow-hidden active:scale-[0.98] transition-transform ${getTypeColor(course.type, 'border')}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide ${getTypeColor(course.type, 'bg')} ${getTypeColor(course.type, 'text')}`}>
                                            {course.type}
                                        </span>
                                        <button className="text-gray-300 hover:text-primary transition-colors">
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                    
                                    <h3 className="font-bold text-textMainLight dark:text-textMainDark text-[15px] mb-1 leading-tight">
                                        {course.title}
                                    </h3>
                                    
                                    <div className="flex items-center gap-4 mt-3">
                                        <div className="flex items-center gap-1.5 text-xs text-textSecLight dark:text-textSecDark">
                                            <MapPin size={14} className="text-gray-400" />
                                            <span>{course.room}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-xs text-textSecLight dark:text-textSecDark">
                                            <User size={14} className="text-gray-400" />
                                            <span>{course.professor}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
          </div>
      </div>
    </div>
  );
};

export default CalendarScreen;
