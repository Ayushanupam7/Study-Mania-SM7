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
    <div className="fixed bottom-6 right-6 z-50" ref={ref}>
      <div className="relative">
        <motion.button 
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center shadow-xl hover:shadow-blue-200/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
        >
          <Plus className="h-6 w-6" />
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              className="absolute bottom-16 right-0"
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="bg-white rounded-lg shadow-xl p-3 border border-slate-100 w-64">
                {actionGroups.map((group, index) => (
                  <div key={group.title} className={`${index > 0 ? 'mt-3 pt-3 border-t border-slate-100' : ''}`}>
                    <div className="text-xs font-medium text-slate-500 mb-2 px-2">{group.title}</div>
                    <div className="space-y-1">
                      {group.items.map((action, i) => (
                        <motion.button 
                          key={action.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 + 0.1 }}
                          className="flex items-center px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md w-full text-left"
                          onClick={action.action}
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {action.icon}
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
