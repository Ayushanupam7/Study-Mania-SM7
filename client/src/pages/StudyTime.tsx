import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { formatStudyTime } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import StudyTimer from '@/components/ui/StudyTimer';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const StudyTime = () => {
  const { subjects, getTotalStudyTimeForToday } = useStudyContext();
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);
  
  const todaysStudyTime = getTotalStudyTimeForToday();
  const formattedTodaysStudyTime = formatStudyTime(todaysStudyTime);
  
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Study Time</h1>
      <p className="text-slate-600 mb-6">Track your study sessions with different timer modes</p>
      
      {/* Today's Study Time */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-slate-500 mb-1">Today's Total Study Time</h2>
        <div className="text-3xl font-semibold">{formattedTodaysStudyTime}</div>
      </div>
      
      {/* Subject Selection */}
      <div className="mb-6">
        <Label 
          htmlFor="subject-select" 
          className="block text-sm text-slate-600 mb-2"
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
              <SelectTrigger className="w-full bg-white">
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
            className="bg-primary text-white hover:bg-blue-700 flex items-center"
            onClick={() => {
              // Get the reference to the Start button in the timer component
              const startButton = document.querySelector('[data-timer-start-button="true"]') as HTMLButtonElement;
              if (startButton) {
                startButton.click();
              }
            }}
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