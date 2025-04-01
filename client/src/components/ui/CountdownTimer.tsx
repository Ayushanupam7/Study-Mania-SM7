import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudyContext } from '@/context/StudyContext';

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
  const { recordStudySession } = useStudyContext();

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
      setIsRunning(false);
      if (onComplete) {
        onComplete();
      }
      
      // Record the study session
      if (subjectId) {
        console.log("Recording study session for subject:", subjectId, "duration:", initialTimeInMinutes * 60);
        recordStudySession(subjectId, initialTimeInMinutes * 60);
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

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(initialTimeInMinutes * 60);
    console.log("Timer reset");
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-slate-50 rounded-xl p-8 text-center mb-8">
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
