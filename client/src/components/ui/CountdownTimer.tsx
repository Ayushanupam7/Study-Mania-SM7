import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, History, Star, Check, Save, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useStudyContext } from '@/context/StudyContext';

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

type CountdownTimerProps = {
  initialTimeInMinutes?: number;
  subjectId?: number | null;
  onComplete?: () => void;
  isPomodoro?: boolean;
};

const CountdownTimer = ({
  initialTimeInMinutes = 25,
  subjectId = null,
  onComplete,
  isPomodoro = false
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [savedDurations, setSavedDurations] = useState<number[]>([]);
  // Track if timer has been started at least once in this session
  const [hasStarted, setHasStarted] = useState(false);
  // Track if timer is completed
  const [isCompleted, setIsCompleted] = useState(false);
  // Session comments
  const [sessionComments, setSessionComments] = useState('');
  // Count pomodoro sessions
  const [pomodoroCount, setPomodoroCount] = useState(0);
  // Track if showing save dialog
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  
  const { recordStudySession } = useStudyContext();
  
  // Load saved durations on component mount
  useEffect(() => {
    setSavedDurations(getSavedDurations());
  }, []);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      console.log("TIMER COMPLETED! Time left:", timeLeft, "isRunning:", isRunning);
      setIsRunning(false);
      setIsCompleted(true);
      
      if (onComplete) {
        console.log("Calling onComplete callback");
        onComplete();
      }
      
      if (isPomodoro) {
        // Increment pomodoro count and show completion message
        setPomodoroCount(prev => prev + 1);
        setShowSaveDialog(true);
      } else {
        // For non-pomodoro timers, auto-record the session
        if (subjectId) {
          console.log("Recording study session for subject:", subjectId, "duration:", initialTimeInMinutes * 60);
          
          // Add a short delay to ensure state updates are processed first
          setTimeout(() => {
            recordStudySession(subjectId, initialTimeInMinutes * 60);
            console.log("Study session recorded after timer completion");
          }, 100);
        } else {
          console.log("No subject selected, study session not recorded");
        }
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onComplete, recordStudySession, subjectId, initialTimeInMinutes, isPomodoro]);

  // Track when timer changes to update UI accordingly
  useEffect(() => {
    setTimeLeft(initialTimeInMinutes * 60);
  }, [initialTimeInMinutes]);

  const toggleTimer = () => {
    if (!isRunning) {
      // Save the current duration when starting
      saveDuration(initialTimeInMinutes);
      setSavedDurations(getSavedDurations());
      setHasStarted(true);
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTimeInMinutes * 60);
    console.log("Timer reset");
  };
  
  const setDuration = (minutes: number) => {
    if (!isRunning) {
      setTimeLeft(minutes * 60);
    }
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  // Handle saving the session with comments
  const handleSaveSession = () => {
    if (subjectId) {
      // Record the study session with comments
      recordStudySession(subjectId, initialTimeInMinutes * 60, sessionComments);
      console.log("Saved study session with comments:", sessionComments);
      
      // Reset the pomodoro state
      setShowSaveDialog(false);
      setSessionComments('');
      
      // Reset the timer for the next session
      resetTimer();
    }
  };
  
  // Handle skipping session save
  const handleSkipSave = () => {
    if (subjectId) {
      // Record the session without comments
      recordStudySession(subjectId, initialTimeInMinutes * 60);
    }
    
    // Reset the pomodoro state
    setShowSaveDialog(false);
    setSessionComments('');
    resetTimer();
  };

  return (
    <div className="bg-slate-50 rounded-xl p-8 text-center mb-8">
      {/* Show saved durations after starting at least once */}
      {hasStarted && !isRunning && !isCompleted && savedDurations.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <History className="h-4 w-4 mr-2 text-slate-500" />
            <span className="text-sm font-medium text-slate-600">Recently Used</span>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {savedDurations.map((duration) => (
              <Badge 
                key={duration} 
                variant="outline"
                className="px-3 py-1 cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setDuration(duration)}
              >
                {duration} min
              </Badge>
            ))}
          </div>
        </div>
      )}
      
      {/* Pomodoro count display if applicable */}
      {isPomodoro && pomodoroCount > 0 && !isRunning && (
        <div className="mb-4">
          <div className="flex items-center justify-center mb-2">
            <Check className="h-4 w-4 mr-2 text-green-500" />
            <span className="text-sm font-medium text-green-600">
              {pomodoroCount} {pomodoroCount === 1 ? 'Pomodoro' : 'Pomodoros'} Completed
            </span>
          </div>
        </div>
      )}
      
      <div className="flex justify-center items-baseline space-x-2">
        <div className="timer-digit">
          <span className="text-5xl font-semibold text-blue-600">{padZero(hours)}</span>
          <div className="text-xs text-slate-500 mt-1">HOURS</div>
        </div>
        <span className="text-5xl font-semibold text-slate-400">:</span>
        <div className="timer-digit">
          <span className="text-5xl font-semibold text-blue-600">{padZero(minutes)}</span>
          <div className="text-xs text-slate-500 mt-1">MINUTES</div>
        </div>
        <span className="text-5xl font-semibold text-slate-400">:</span>
        <div className="timer-digit">
          <span className="text-5xl font-semibold text-blue-600">{padZero(seconds)}</span>
          <div className="text-xs text-slate-500 mt-1">SECONDS</div>
        </div>
      </div>

      <div className="flex justify-center space-x-4 mt-8">
        <Button 
          className="px-6 py-2 bg-primary text-white rounded-md font-medium hover:bg-blue-600 flex items-center"
          onClick={toggleTimer}
          disabled={isCompleted}
          data-timer-start-button="true"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-5 w-5 mr-2" />
              Start
            </>
          )}
        </Button>
        <Button
          variant="outline"
          className="px-6 py-2 bg-slate-200 text-slate-700 rounded-md font-medium hover:bg-slate-300 flex items-center"
          onClick={resetTimer}
          disabled={isRunning}
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
      
      {/* Save Session Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Save className="h-5 w-5 mr-2 text-primary" />
              Save Study Session
            </DialogTitle>
            <DialogDescription>
              Great job completing your {initialTimeInMinutes} minute 
              {isPomodoro ? ' pomodoro' : ''} session! Add some notes about what you accomplished.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="comments" className="text-sm font-medium">
              Session Notes <span className="text-slate-400">(optional)</span>
            </Label>
            <Textarea
              id="comments"
              placeholder="What did you study? What progress did you make?"
              value={sessionComments}
              onChange={(e) => setSessionComments(e.target.value)}
              className="mt-2 resize-none"
              rows={4}
            />
          </div>
          
          <DialogFooter className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handleSkipSave}
              className="px-4 py-2"
            >
              Skip
            </Button>
            <Button 
              onClick={handleSaveSession}
              className="px-4 py-2 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CountdownTimer;
