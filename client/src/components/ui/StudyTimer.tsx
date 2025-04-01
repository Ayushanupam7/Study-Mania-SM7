import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Stopwatch from '@/components/ui/Stopwatch';
import { Clock } from 'lucide-react';
import { useStudyContext } from '@/context/StudyContext';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'timer' | 'stopwatch' | 'pomodoro';

type StudyTimerProps = {
  subjectId: number | null;
};

const StudyTimer = ({ subjectId }: StudyTimerProps) => {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const { toast } = useToast();
  const { subjects } = useStudyContext();

  const subjectName = subjectId 
    ? subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject'
    : 'No Subject';

  const handlePomodoroPresetClick = (minutes: number) => {
    setPomodoroTime(minutes);
  };

  const handleTimerComplete = () => {
    toast({
      title: "Timer completed!",
      description: `Your ${pomodoroTime} minute study session for ${subjectName} is complete.`,
    });
  };

  const handleStopwatchComplete = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    toast({
      title: "Study session recorded!",
      description: `You studied ${subjectName} for ${minutes}m ${seconds}s.`,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <Tabs defaultValue={mode} onValueChange={(v) => setMode(v as TimerMode)} className="w-full">
        <TabsList className="flex border-b border-slate-200 mb-6 bg-transparent p-0">
          <TabsTrigger 
            value="timer" 
            className="px-4 py-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium flex items-center bg-transparent"
          >
            <Clock className="h-5 w-5 mr-2" />
            Timer
          </TabsTrigger>
          <TabsTrigger 
            value="stopwatch" 
            className="px-4 py-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium flex items-center bg-transparent"
          >
            <Clock className="h-5 w-5 mr-2" />
            Stopwatch
          </TabsTrigger>
          <TabsTrigger 
            value="pomodoro" 
            className="px-4 py-2 data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary font-medium flex items-center bg-transparent"
          >
            <Clock className="h-5 w-5 mr-2" />
            Pomodoro
          </TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="mt-0">
          <div className="flex gap-2 mb-8">
            <Button
              variant={pomodoroTime === 25 ? "default" : "outline"}
              className={pomodoroTime === 25 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(25)}
            >
              25 min
            </Button>
            <Button
              variant={pomodoroTime === 45 ? "default" : "outline"}
              className={pomodoroTime === 45 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(45)}
            >
              45 min
            </Button>
            <Button
              variant={pomodoroTime === 60 ? "default" : "outline"}
              className={pomodoroTime === 60 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(60)}
            >
              1 hour
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="h-1 bg-blue-500 w-full rounded-full mb-6"></div>
          </div>
          
          <CountdownTimer 
            initialTimeInMinutes={pomodoroTime} 
            subjectId={subjectId} 
            onComplete={handleTimerComplete}
          />
        </TabsContent>
        
        <TabsContent value="stopwatch" className="mt-0">
          <div className="flex justify-center">
            <div className="h-1 bg-blue-500 w-full rounded-full mb-6"></div>
          </div>
          
          <Stopwatch 
            subjectId={subjectId} 
            onComplete={handleStopwatchComplete}
          />
        </TabsContent>
        
        <TabsContent value="pomodoro" className="mt-0">
          <div className="flex gap-2 mb-8">
            <Button
              variant={pomodoroTime === 25 ? "default" : "outline"}
              className={pomodoroTime === 25 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(25)}
            >
              25 min
            </Button>
            <Button
              variant={pomodoroTime === 45 ? "default" : "outline"}
              className={pomodoroTime === 45 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(45)}
            >
              45 min
            </Button>
            <Button
              variant={pomodoroTime === 60 ? "default" : "outline"}
              className={pomodoroTime === 60 
                ? "px-4 py-2 bg-blue-100 text-blue-700 border-0" 
                : "px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }
              onClick={() => handlePomodoroPresetClick(60)}
            >
              1 hour
            </Button>
          </div>
          
          <div className="flex justify-center">
            <div className="h-1 bg-blue-500 w-full rounded-full mb-6"></div>
          </div>
          
          <CountdownTimer 
            initialTimeInMinutes={pomodoroTime} 
            subjectId={subjectId} 
            onComplete={handleTimerComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyTimer;
