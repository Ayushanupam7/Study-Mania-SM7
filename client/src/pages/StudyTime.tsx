import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { formatStudyTime } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StudyTimer from '@/components/ui/StudyTimer';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const StudyTime = () => {
  const { subjects, getTotalStudyTimeForToday, isFocusMode, setIsFocusMode } = useStudyContext();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  const todaysStudyTime = getTotalStudyTimeForToday();
  const formattedTodaysStudyTime = formatStudyTime(todaysStudyTime);
  
  const handleQuickStart = () => {
    try {
      const startButton = document.querySelector('[data-timer-start-button="true"]') as HTMLButtonElement;
      if (startButton) {
        startButton.click();
        setIsFocusMode(true);
      } else {
        console.warn('Timer start button not found');
      }
    } catch (error) {
      console.error('Error starting timer:', error);
    }
  };

  return (
    <div className={isFocusMode ? "focus-mode" : ""}>
      <h1 className="text-2xl font-semibold mb-2">Study Time</h1>
      <p className="text-muted-foreground mb-6">Track your study sessions with different timer modes</p>
      
      {/* Today's Study Time */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-muted-foreground mb-1">Today's Total Study Time</h2>
        <div className="text-3xl font-semibold">{formattedTodaysStudyTime}</div>
      </div>
      
      {/* Subject Selection */}
      <div className="mb-6">
        <Label 
          htmlFor="subject-select" 
          className="block text-sm text-muted-foreground mb-2"
        >
          Select a subject for this study session:
        </Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <Select 
              value={selectedSubjectId?.toString() || 'no-subject'} 
              onValueChange={(value) => 
                setSelectedSubjectId(value === 'no-subject' ? null : parseInt(value))
              }
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder="No Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-subject">No Subject</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="default"
            onClick={handleQuickStart}
            disabled={!selectedSubjectId}
          >
            <Play className="h-5 w-5 mr-2" />
            Quick Start
          </Button>
        </div>
      </div>
      
      {/* Timer Component */}
      <StudyTimer subjectId={selectedSubjectId} />
    </div>
  );
};

export default StudyTime;