import { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Clock,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Calendar as CalendarIcon,
} from 'lucide-react';
import CountdownTimer from '@/components/ui/CountdownTimer';
import Stopwatch from '@/components/ui/Stopwatch';
import { useStudyContext } from '@/context/StudyContext';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Plus, Trash2, CheckSquare, Square } from 'lucide-react';

type TimerMode = 'timer' | 'stopwatch' | 'pomodoro';

const StudyTimer = ({ subjectId: initialSubjectId }: { subjectId: number | null }) => {
  const [mode, setMode] = useState<TimerMode>('timer');
  const [pomodoroTime, setPomodoroTime] = useState(25);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(initialSubjectId);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    subjectId: initialSubjectId ?? null,
    date: new Date(),
  });

  // Add new task management functions
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlannerItem({ ...newTask, isCompleted: false });
      setNewTask({
        title: '',
        description: '',
        subjectId: selectedSubjectId ?? null,
        date: new Date(),
      });
      setIsAddDialogOpen(false);
    } catch (err) {
      console.error('Error creating task:', err);
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      await updatePlannerItem(task.id, {
        isCompleted: !task.isCompleted,
      });
    } catch (err) {
      console.error('Error toggling task:', err);
    }
  };

  const handleEditTask = async (id: string) => {
    try {
      await updatePlannerItem(id, { title: editedTitle });
      setEditingTaskId(null);
    } catch (err) {
      console.error('Error editing task:', err);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deletePlannerItem(id);
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-white overflow-auto' : ''}`}>
      <div className="flex justify-end mb-4">
        <Button
          onClick={() => setIsFullscreen(!isFullscreen)}
          variant="outline"
          className="flex items-center gap-2 text-sm"
        >
          {isFullscreen ? (
            <>
              <span>Exit Fullscreen</span>
            </>
          ) : (
            <>
              <span>Study Mode</span>
            </>
          )}
        </Button>
      </div>

      {!isFullscreen && <h2 className="text-xl font-semibold mb-4">Study Time</h2>}

      <Tabs defaultValue={mode} onValueChange={(v) => setMode(v as TimerMode)} className="w-full">
        <TabsList className="flex border-b border-slate-200 mb-6">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
          <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
        </TabsList>

        <TabsContent value="timer">
          <CountdownTimer initialTimeInMinutes={pomodoroTime} subjectId={selectedSubjectId} onComplete={handleTimerComplete} isPomodoro={false} />
        </TabsContent>
        <TabsContent value="stopwatch">
          <Stopwatch subjectId={selectedSubjectId} onComplete={handleStopwatchComplete} />
        </TabsContent>
        <TabsContent value="pomodoro">
          <CountdownTimer initialTimeInMinutes={pomodoroTime} subjectId={selectedSubjectId} onComplete={handleTimerComplete} isPomodoro />
        </TabsContent>
      </Tabs>

      {isFullscreen && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] max-w-3xl bg-white border border-slate-200 rounded-xl shadow-xl p-6 space-y-4">
          <div>
            <Label className="text-sm text-slate-700 mb-1 block">Subject Focus</Label>
            <Select
              value={selectedSubjectId?.toString() || 'null'}
              onValueChange={(value) => {
                const parsed = value === 'null' ? null : parseInt(value);
                setSelectedSubjectId(parsed);
                setNewTask((prev) => ({ ...prev, subjectId: parsed }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="null">All Subjects</SelectItem>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">🎯 Focused Tasks for Today</h3>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleCreateTask}>
                  <DialogHeader>
                    <DialogTitle>Add Task</DialogTitle>
                    <DialogDescription>Sync this task to your Planner.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="title" className="text-right">Title</Label>
                      <Input id="title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea id="description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="date" className="text-right">Date</Label>
                      <div className="col-span-3">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {format(newTask.date, 'PPP')}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={newTask.date} onSelect={(date) => date && setNewTask({ ...newTask, date })} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Task</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {fullscreenTasks.length > 0 ? (
              fullscreenTasks.map((task) => (
                <div key={task.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-md hover:bg-slate-100 group">
                  <Button onClick={() => handleToggleComplete(task)} variant="ghost" size="icon" className="mt-1">
                    {task.isCompleted ? <CheckSquare className="text-green-600 w-5 h-5" /> : <Square className="text-slate-400 hover:text-slate-600 w-5 h-5" />}
                  </Button>
                  <div className="flex-1 space-y-1">
                    {editingTaskId === task.id ? (
                      <Input
                        value={editedTitle}
                        onChange={(e) => setEditedTitle(e.target.value)}
                        onBlur={() => handleEditTask(task.id)}
                        onKeyDown={(e) => e.key === 'Enter' && handleEditTask(task.id)}
                        className="text-sm"
                        autoFocus
                      />
                    ) : (
                      <div onDoubleClick={() => {
                        setEditingTaskId(task.id);
                        setEditedTitle(task.title);
                      }} className={`text-sm font-medium ${task.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </div>
                    )}
                    {task.description && (
                      <p className="text-xs text-slate-500">{task.description}</p>
                    )}
                  </div>
                  <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-slate-500 text-sm py-4">No tasks for this subject today.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyTimer;
