import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, History, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
};

const CountdownTimer = ({
  initialTimeInMinutes = 25,
  subjectId = null,
  onComplete
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeInMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [savedDurations, setSavedDurations] = useState<number[]>([]);
  // Track if timer has been started at least once in this session
  const [hasStarted, setHasStarted] = useState(false);
  
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
      
      if (onComplete) {
        console.log("Calling onComplete callback");
        onComplete();
      }
      
      // Record the study session
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

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, timeLeft, onComplete, recordStudySession, subjectId, initialTimeInMinutes]);

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

  return (
    <div className="bg-slate-50 rounded-xl p-8 text-center mb-8">
      {/* Show saved durations after starting at least once */}
      {hasStarted && !isRunning && savedDurations.length > 0 && (
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
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default CountdownTimer;
