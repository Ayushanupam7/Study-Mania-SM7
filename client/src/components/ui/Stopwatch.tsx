import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStudyContext } from '@/context/StudyContext';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

type StopwatchProps = {
  subjectId?: number | null;
  onComplete?: (totalSeconds: number) => void;
};

const Stopwatch = ({ subjectId = null, onComplete }: StopwatchProps) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [previousRunTime, setPreviousRunTime] = useState(0); // Track time when stopwatch was last paused
  const [hasStarted, setHasStarted] = useState(false); // Track if stopwatch has been started
  const [showSaveDialog, setShowSaveDialog] = useState(false); // For save dialog
  const [sessionComments, setSessionComments] = useState(''); // For session comments
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { recordStudySession, subjects } = useStudyContext();
  const { toast } = useToast();

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  
  const subjectName = subjectId 
    ? subjects.find(s => s.id === subjectId)?.name || 'Unknown Subject'
    : 'No Subject';

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
    if (isRunning) {
      // When pausing the stopwatch
      setPreviousRunTime(time);
      
      // Show save dialog if we have time and a subject
      if (time > 0 && subjectId) {
        setSessionComments('');
        setShowSaveDialog(true);
      }
    } else {
      // When starting the stopwatch
      setHasStarted(true);
      
      // If restarting, notify the user
      if (previousRunTime > 0) {
        toast({
          title: "Stopwatch resumed",
          description: `Continuing your study session for ${subjectName}.`,
        });
      } else {
        toast({
          title: "Stopwatch started",
          description: `Starting a new study session for ${subjectName}.`,
        });
      }
    }
    
    setIsRunning(!isRunning);
  };

  const resetStopwatch = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // When resetting, if we've counted some time, record it as a session
    if (time > 0 && subjectId) {
      console.log("Stopwatch reset - Recording study session for subject:", subjectId, "duration:", time);
      recordStudySession(subjectId, time);
      
      if (onComplete) {
        onComplete(time);
      }
    } else {
      console.log("Not recording study session on reset:", { subjectId, time });
    }
    
    setTime(0);
  };

  const padZero = (num: number) => num.toString().padStart(2, '0');

  // Handle saving the session with comments
  const handleSaveSession = () => {
    if (subjectId && time > 0) {
      // Record the study session with comments
      recordStudySession(subjectId, time, sessionComments);
      
      toast({
        title: "Session saved",
        description: `Your ${minutes} min ${seconds} sec study session was saved.`,
      });
      
      // Reset states
      setShowSaveDialog(false);
      setSessionComments('');
      setPreviousRunTime(0);
      setTime(0);
    }
  };
  
  // Skip saving session but still record it
  const handleSkipSave = () => {
    if (subjectId && time > 0) {
      // Record the session without comments
      recordStudySession(subjectId, time);
      toast({
        title: "Session recorded",
        description: `${minutes} min ${seconds} sec study session recorded.`,
      });
    }
    
    // Reset states
    setShowSaveDialog(false);
    setSessionComments('');
    setPreviousRunTime(0);
    setTime(0);
  };

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
      
      {/* Save Session Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Save className="h-5 w-5 mr-2 text-primary" />
              Save Study Session
            </DialogTitle>
            <DialogDescription>
              Save your {Math.floor(time / 60)}m {time % 60}s study session for {subjectName}.
              Add some notes about what you accomplished.
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

export default Stopwatch;
