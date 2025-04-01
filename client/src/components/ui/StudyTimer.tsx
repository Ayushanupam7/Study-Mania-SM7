import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Stopwatch from '@/components/ui/Stopwatch';
import { Clock, Star, History } from 'lucide-react';
import { useStudyContext } from '@/context/StudyContext';
import { useToast } from '@/hooks/use-toast';

type TimerMode = 'timer' | 'stopwatch' | 'pomodoro';

type StudyTimerProps = {
  subjectId: number | null;
};

// Helper function to get saved durations from localStorage
const getSavedDurations = (): number[] => {
  try {
    const saved = localStorage.getItem('studyMania_savedDurations');
    return saved ? JSON.parse(saved) : [5, 25, 45, 60];
  } catch (error) {
    console.error("Error parsing saved durations:", error);
    return [5, 25, 45, 60];
  }
};

// Helper function to save durations to localStorage
const saveDuration = (duration: number) => {
  try {
    const currentSaved = getSavedDurations();
    // Only add if it doesn't already exist
    if (!currentSaved.includes(duration)) {
      // Keep only the last 5 unique durations
      const newSaved = [duration, ...currentSaved].slice(0, 5);
      localStorage.setItem('studyMania_savedDurations', JSON.stringify(newSaved));
    }
  } catch (error) {
    console.error("Error saving duration:", error);
  }
};

const StudyTimer = ({ subjectId }: StudyTimerProps) => {
  // Default to timer mode for quick start functionality
  const [mode, setMode] = useState<TimerMode>('timer');
  // Default time set to 5 minutes
  const [pomodoroTime, setPomodoroTime] = useState(5);
  // Track saved/recent durations
  const [savedDurations, setSavedDurations] = useState<number[]>([]);
  // Track if timer is active
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const { toast } = useToast();
  const { subjects } = useStudyContext();
  
  // Load saved durations on component mount
  useEffect(() => {
    setSavedDurations(getSavedDurations());
  }, []);

  const subjectName = subjectId 
    ? subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject'
    : 'No Subject';

  const handlePomodoroPresetClick = (minutes: number) => {
    setPomodoroTime(minutes);
  };
  
  const handleStartTimer = () => {
    // Save the current duration to localStorage
    saveDuration(pomodoroTime);
    // Update the saved durations in the state
    setSavedDurations(getSavedDurations());
    setIsTimerActive(true);
    
    toast({
      title: "Timer started!",
      description: `Starting a ${pomodoroTime} minute study session for ${subjectName}.`,
    });
  };

  const handleTimerComplete = () => {
    setIsTimerActive(false);
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

  const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val > 0 && val <= 120) {
      setPomodoroTime(val);
    }
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
          <div className="flex flex-col gap-2 mb-8">
            <div className="mb-2">
              <Label htmlFor="time-input" className="font-medium mb-1 block">
                Set Timer Duration (minutes)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="time-input"
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroTime}
                  onChange={handleTimeInputChange}
                  className="w-24"
                />
                <span>minutes</span>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => handlePomodoroPresetClick(5)}
              >
                5 min
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => handlePomodoroPresetClick(15)}
              >
                15 min
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => handlePomodoroPresetClick(30)}
              >
                30 min
              </Button>
              <Button
                variant="outline"
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => handlePomodoroPresetClick(60)}
              >
                1 hour
              </Button>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="h-1 bg-blue-500 w-full rounded-full mb-6"></div>
          </div>
          
          <CountdownTimer 
            initialTimeInMinutes={pomodoroTime} 
            subjectId={subjectId} 
            onComplete={handleTimerComplete}
            isPomodoro={false}
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
          <div className="flex flex-col gap-2 mb-6">
            <div className="mb-4">
              <Label htmlFor="pomodoro-input" className="font-medium mb-1 block">
                Set Pomodoro Duration (minutes)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="pomodoro-input"
                  type="number"
                  min="1"
                  max="120"
                  value={pomodoroTime}
                  onChange={handleTimeInputChange}
                  className="w-24"
                />
                <span>minutes</span>
              </div>
            </div>
            
            {/* Pomodoro presets */}
            <div className="mb-2">
              <Label className="font-medium mb-1 block text-sm">
                Pomodoro Presets
              </Label>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => handlePomodoroPresetClick(25)}
                >
                  25 min
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => handlePomodoroPresetClick(45)}
                >
                  45 min
                </Button>
                <Button
                  variant="outline"
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  onClick={() => handlePomodoroPresetClick(60)}
                >
                  1 hour
                </Button>
              </div>
            </div>
            
            {/* Pomodoro technique info */}
            <div className="bg-blue-50 rounded-md p-3 text-sm text-slate-700 mb-2">
              <h4 className="font-medium mb-1 flex items-center">
                <Clock className="h-4 w-4 mr-1 text-blue-500" />
                Pomodoro Technique
              </h4>
              <p className="text-xs">
                The Pomodoro Technique uses timed intervals (typically 25 minutes) 
                of focused work followed by a short break. After 4 pomodoros, take a longer break.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="h-1 bg-blue-500 w-full rounded-full mb-6"></div>
          </div>
          
          <CountdownTimer 
            initialTimeInMinutes={pomodoroTime} 
            subjectId={subjectId} 
            onComplete={handleTimerComplete}
            isPomodoro={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudyTimer;