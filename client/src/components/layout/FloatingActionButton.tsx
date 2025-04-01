import { useState, useRef, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  Timer, 
  Hourglass, 
  FileText, 
  BookOpen, 
  Calendar, 
  AlarmClock,
  Brain,
  ListChecks,
  BarChart
} from 'lucide-react';
import { useClickAway } from '@/hooks/use-click-away';
import { useStudyContext } from '@/context/StudyContext';
import { motion, AnimatePresence } from 'framer-motion';

type ActionItem = {
  id: string;
  label: string;
  icon: JSX.Element;
  action: () => void;
};

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { createTimer, createStopwatch, createCountdown, createFlashcardFromFAB, createSubjectFromFAB, createPlannerItemFromFAB } = useStudyContext();

  useClickAway(ref, () => {
    setIsOpen(false);
  });

  // Group actions by category
  const actionGroups = [
    {
      title: "Study Timers",
      items: [
        {
          id: 'timer',
          label: 'Set Timer',
          icon: <Clock className="h-5 w-5 mr-3 text-blue-500" />,
          action: () => {
            createTimer();
            setIsOpen(false);
          }
        },
        {
          id: 'stopwatch',
          label: 'Stopwatch',
          icon: <Timer className="h-5 w-5 mr-3 text-indigo-500" />,
          action: () => {
            createStopwatch();
            setIsOpen(false);
          }
        },
        {
          id: 'countdown',
          label: 'Countdown',
          icon: <Hourglass className="h-5 w-5 mr-3 text-purple-500" />,
          action: () => {
            createCountdown();
            setIsOpen(false);
          }
        }
      ]
    },
    {
      title: "Study Materials",
      items: [
        {
          id: 'flashcard',
          label: 'New Flashcard',
          icon: <FileText className="h-5 w-5 mr-3 text-green-500" />,
          action: () => {
            createFlashcardFromFAB();
            setIsOpen(false);
          }
        },
        {
          id: 'subject',
          label: 'New Subject',
          icon: <BookOpen className="h-5 w-5 mr-3 text-amber-500" />,
          action: () => {
            createSubjectFromFAB();
            setIsOpen(false);
          }
        },
        {
          id: 'planner-item',
          label: 'New Task',
          icon: <Calendar className="h-5 w-5 mr-3 text-rose-500" />,
          action: () => {
            createPlannerItemFromFAB();
            setIsOpen(false);
          }
        }
      ]
    }
  ];
  
  // Extract all actions for quick reference
  const actions: ActionItem[] = actionGroups.flatMap(group => group.items);

  return (
    <div className="fab-container" ref={ref}>
      {/* Floating Action Button Container
         - Fixed position at bottom right of the screen
         - Reference for click-away detection */}
      <div className="relative">
        {/* Main FAB Button
           - Uses framer-motion for smooth animations
           - Changes appearance when open/closed */}
        <motion.button 
          className="fab-button"
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            rotate: isOpen ? 45 : 0,
            boxShadow: isOpen 
              ? '0 10px 25px -5px rgba(59, 130, 246, 0.5)' 
              : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
          transition={{ duration: 0.2 }}
          aria-label="Open menu"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
        
        {/* Menu Container with Animation
           - Only renders when open
           - AnimatePresence handles enter/exit animations */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 right-0"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="fab-menu">
                {actionGroups.map((group, index) => (
                  <div key={group.title} className={index > 0 ? 'fab-menu-group-divider' : ''}>
                    {/* Group title */}
                    <div className="fab-menu-title">{group.title}</div>
                    
                    <div className="space-y-1">
                      {group.items.map((action, i) => (
                        <motion.button 
                          key={action.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 + 0.1 }}
                          className="fab-menu-item"
                          onClick={action.action}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <span className="fab-icon">{action.icon}</span>
                          <span>{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FloatingActionButton;
