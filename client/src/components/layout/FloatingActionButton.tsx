import { useState, useRef, useEffect } from 'react';
import { Plus, Clock, Timer, Hourglass, FileText, BookOpen, Calendar } from 'lucide-react';
import { useClickAway } from '@/hooks/use-click-away';
import { useStudyContext } from '@/context/StudyContext';

type ActionItem = {
  id: string;
  label: string;
  icon: JSX.Element;
  action: () => void;
};

const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { createTimer, createStopwatch, createCountdown, createFlashcard, createSubject, createPlannerItem } = useStudyContext();

  useClickAway(ref, () => {
    setIsOpen(false);
  });

  const actions: ActionItem[] = [
    {
      id: 'timer',
      label: 'Timer',
      icon: <Clock className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createTimer();
        setIsOpen(false);
      }
    },
    {
      id: 'stopwatch',
      label: 'Stopwatch',
      icon: <Timer className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createStopwatch();
        setIsOpen(false);
      }
    },
    {
      id: 'countdown',
      label: 'Countdown',
      icon: <Hourglass className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createCountdown();
        setIsOpen(false);
      }
    },
    {
      id: 'flashcard',
      label: 'Flashcard',
      icon: <FileText className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createFlashcard();
        setIsOpen(false);
      }
    },
    {
      id: 'subject',
      label: 'Subject',
      icon: <BookOpen className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createSubject();
        setIsOpen(false);
      }
    },
    {
      id: 'planner-item',
      label: 'Planner Item',
      icon: <Calendar className="h-5 w-5 mr-3 text-blue-500" />,
      action: () => {
        createPlannerItem();
        setIsOpen(false);
      }
    }
  ];

  return (
    <div className="fixed bottom-6 right-6" ref={ref}>
      <div className="relative group">
        <button 
          className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Plus className="h-6 w-6" />
        </button>
        
        {isOpen && (
          <div className="absolute bottom-16 right-0 bg-white rounded-md shadow-lg p-2">
            <div className="w-48">
              <div className="p-2 font-medium border-b border-slate-100">Create New</div>
              <ul className="mt-2">
                {actions.map((action) => (
                  <li key={action.id}>
                    <button 
                      className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 rounded-md w-full text-left"
                      onClick={action.action}
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionButton;
