import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudyContext } from '@/context/StudyContext';

type StopwatchProps = {
  subjectId?: number | null;
  onComplete?: (totalSeconds: number) => void;
};

const Stopwatch = ({ subjectId = null, onComplete }: StopwatchProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { recordStudySession } = useStudyContext();

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime(prev => prev + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);

  const toggleStopwatch = () => {
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // When resetting, if we've counted some time, record it as a session
    if (time > 0 && subjectId) {
      recordStudySession(subjectId, time);
      
      if (onComplete) {
        onComplete(time);
      }
    }
    
    setTime(0);
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
          onClick={toggleStopwatch}
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
          onClick={resetStopwatch}
        >
          <RotateCcw className="h-5 w-5 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Stopwatch;
