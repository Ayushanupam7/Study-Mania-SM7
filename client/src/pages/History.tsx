import { useState, useRef } from 'react';
import { useStudyContext } from '@/context/StudyContext';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Edit, Trash2, Check, X, Download } from 'lucide-react'; // Added Download icon
import { format } from 'date-fns';
import { formatStudyTime } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { jsPDF } from "jspdf"; // Added jspdf import


type EditingSession = {
  id: number;
  comments: string | null;
};

const History = () => {
  const { studySessions, subjects, getTotalStudyTime, updateStudySession, deleteStudySession } = useStudyContext();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<EditingSession | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined } | undefined>();

  // Get total study time across all sessions
  const totalStudyTime = getTotalStudyTime();
  const formattedTotalStudyTime = formatStudyTime(totalStudyTime);

  // For inline editing
  const commentsInputRef = useRef<HTMLTextAreaElement>(null);

  // Filter sessions by selected date range if any
  const filteredSessions = dateRange?.from && dateRange?.to
    ? studySessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= dateRange.from! && sessionDate <= dateRange.to!;
      })
    : studySessions;


  // Sort sessions by date (newest first)
  const sortedSessions = [...filteredSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Handle opening edit dialog
  const handleEditClick = (session: typeof studySessions[0]) => {
    setEditingSession({
      id: session.id,
      comments: session.comments
    });
    setIsEditDialogOpen(true);
  };

  // Handle saving comments
  const handleSaveComments = () => {
    if (!editingSession) return;

    updateStudySession(editingSession.id, {
      comments: editingSession.comments
    });

    setEditingSession(null);
    setIsEditDialogOpen(false);
  };

  // Handle delete session
  const handleDeleteSession = (sessionId: number) => {
    deleteStudySession(sessionId);
  };

  const exportToPDF = () => {
    // Placeholder for PDF export functionality.  Replace with actual PDF generation logic.
    const doc = new jsPDF();
    doc.text("Study History Report", 10, 10);
    doc.save("study_history.pdf");
  };

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
              mode="range" // Changed to range selection
              selected={dateRange} // Use dateRange for selection
              onSelect={(date) => setDateRange(date)} // Update dateRange
              initialFocus
            />
            <div className="p-2 border-t border-slate-100">
              <Button 
                variant="ghost" 
                className="w-full justify-center"
                onClick={() => {
                  setDateRange({ from: undefined, to: undefined });
                  setIsCalendarOpen(false);
                }}
              >
                Clear Selection
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          onClick={exportToPDF}
          disabled={!dateRange.from || !dateRange.to}
          className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
        >
          <Download className="h-5 w-5 mr-2" />
          Export PDF
        </Button>
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
              <TableHead className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-white divide-y divide-slate-200">
            {sortedSessions.length > 0 ? (
              sortedSessions.map((session) => {
                const subject = subjects.find(s => s.id === session.subjectId);
                return (
                  <TableRow key={session.id}>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      <div className="font-medium">{format(new Date(session.date), 'MMMM d, yyyy')}</div>
                      <div className="text-xs text-slate-500">{format(new Date(session.date), 'h:mm a')}</div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {subject?.name || 'Unknown Subject'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {formatStudyTime(session.duration)}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-slate-700 max-w-[250px] truncate">
                      {session.comments || '-'}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this study session and remove its duration from your total study time.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSession(session.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  {dateRange.from && dateRange.to
                    ? 'No study sessions recorded for this date range.'
                    : 'No study sessions recorded yet. Start studying to track your progress.'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Comments Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Session Comments</DialogTitle>
            <DialogDescription>
              Add details about what you studied during this session.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="comments">Comments</Label>
            <Textarea
              id="comments"
              className="mt-2"
              placeholder="What did you study? What progress did you make?"
              value={editingSession?.comments || ''}
              onChange={(e) => setEditingSession(prev => 
                prev ? { ...prev, comments: e.target.value } : null
              )}
              rows={4}
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSaveComments}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default History;