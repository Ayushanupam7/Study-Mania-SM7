import { useState } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { formatStudyTime } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const History = () => {
  const { studySessions, subjects, getTotalStudyTime } = useStudyContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  
  // Get total study time across all sessions
  const totalStudyTime = getTotalStudyTime();
  const formattedTotalStudyTime = formatStudyTime(totalStudyTime);

  // Filter sessions by selected date if any
  const filteredSessions = selectedDate 
    ? studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getFullYear() === selectedDate.getFullYear() &&
          sessionDate.getMonth() === selectedDate.getMonth() &&
          sessionDate.getDate() === selectedDate.getDate()
        );
      })
    : studySessions;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Study History</h1>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 py-2 px-4 rounded-md flex items-center"
            >
              <CalendarIcon className="h-5 w-5 mr-2" />
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                setSelectedDate(date);
                setIsCalendarOpen(false);
              }}
              initialFocus
            />
            {selectedDate && (
              <div className="p-2 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  className="w-full justify-center"
                  onClick={() => {
                    setSelectedDate(undefined);
                    setIsCalendarOpen(false);
                  }}
                >
                  Clear Selection
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Total Study Time Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <p className="text-lg font-medium">
          Total Study Time: {formattedTotalStudyTime}
        </p>
      </div>
      
      {/* Study History Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subject</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Duration</TableHead>
              <TableHead className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-slate-200">
            {sortedSessions.length > 0 ? (
              sortedSessions.map((session) => {
                const subject = subjects.find(s => s.id === session.subjectId);
                return (
                  <TableRow key={session.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {format(new Date(session.date), 'MMMM d, yyyy')}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {subject?.name || 'Unknown Subject'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {formatStudyTime(session.duration)}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {session.comments || '-'}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="px-6 py-8 text-center text-slate-500">
                  {selectedDate 
                    ? 'No study sessions recorded for this date.'
                    : 'No study sessions recorded yet. Start studying to track your progress.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default History;
