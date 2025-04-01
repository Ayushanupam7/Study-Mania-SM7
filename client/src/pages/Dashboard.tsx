import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useStudyContext } from '@/context/StudyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, BookOpen, FileText, Calendar, Plus, Pencil, Trash2 } from 'lucide-react';
import { formatStudyTime } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showDialog, setShowDialog] = useState(false);
  const [editingCountdown, setEditingCountdown] = useState<any>(null);
  const [countdownName, setCountdownName] = useState('');
  const [countdownDuration, setCountdownDuration] = useState('');
  const queryClient = useQueryClient();

  const { data: countdowns = [] } = useQuery({
    queryKey: ['countdowns'],
    queryFn: async () => {
      const response = await fetch('/api/countdowns');
      if (!response.ok) throw new Error('Failed to fetch countdowns');
      return response.json();
    }
  });

  const createCountdown = useMutation({
    mutationFn: async (data: { name: string; duration: number }) => {
      const response = await fetch('/api/countdowns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create countdown');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countdowns'] });
      toast({ title: 'Countdown created successfully' });
      setShowDialog(false);
      resetForm();
    }
  });

  const updateCountdown = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: { name: string; duration: number } }) => {
      const response = await fetch(`/api/countdowns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update countdown');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countdowns'] });
      toast({ title: 'Countdown updated successfully' });
      setShowDialog(false);
      resetForm();
    }
  });

  const deleteCountdown = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/countdowns/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete countdown');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countdowns'] });
      toast({ title: 'Countdown deleted successfully' });
    }
  });

  const resetForm = () => {
    setCountdownName('');
    setCountdownDuration('');
    setEditingCountdown(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = parseInt(countdownDuration);
    if (!countdownName || isNaN(duration)) {
      toast({ title: 'Please fill all fields correctly', variant: 'destructive' });
      return;
    }

    if (editingCountdown) {
      updateCountdown.mutate({
        id: editingCountdown.id,
        data: { name: countdownName, duration }
      });
    } else {
      createCountdown.mutate({ name: countdownName, duration });
    }
  };

  const handleEdit = (countdown: any) => {
    setEditingCountdown(countdown);
    setCountdownName(countdown.name);
    setCountdownDuration(countdown.duration.toString());
    setShowDialog(true);
  };
  const { subjects, flashcards, plannerItems, getTotalStudyTime, getTotalStudyTimeForToday } = useStudyContext();
  
  // Get total study time
  const totalStudyTime = getTotalStudyTime();
  const formattedTotalStudyTime = formatStudyTime(totalStudyTime);
  
  // Get today's study time
  const todayStudyTime = getTotalStudyTimeForToday();
  const formattedTodayStudyTime = formatStudyTime(todayStudyTime);
  
  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  const upcomingTasks = plannerItems
    .filter(item => !item.isCompleted)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-slate-600">{format(currentTime, 'EEEE, MMMM d, yyyy • hh:mm:ss a')}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-xl font-medium mb-1">
            Total Study Time: {formattedTotalStudyTime}
          </div>
          <div className="text-sm font-medium text-blue-600 flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            Today: {formattedTodayStudyTime}
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
            <p className="text-xs text-muted-foreground">
              {subjects.length === 0 ? 'No subjects added yet' : 'Subjects to study'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Flashcards</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flashcards.length}</div>
            <p className="text-xs text-muted-foreground">
              {flashcards.length === 0 ? 'No flashcards created yet' : 'Flashcards to review'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming Tasks</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {upcomingTasks.length === 0 ? 'No pending tasks' : 'Tasks to complete'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countdowns */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Countdowns</h2>
          <Button onClick={() => { resetForm(); setShowDialog(true); }} variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Countdown
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {countdowns.map((countdown: any) => (
            <Card key={countdown.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{countdown.name}</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(countdown)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteCountdown.mutate(countdown.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatStudyTime(countdown.duration)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Countdown Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCountdown ? 'Edit Countdown' : 'New Countdown'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={countdownName}
                onChange={(e) => setCountdownName(e.target.value)}
                placeholder="Enter countdown name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (seconds)</Label>
              <Input
                id="duration"
                type="number"
                value={countdownDuration}
                onChange={(e) => setCountdownDuration(e.target.value)}
                placeholder="Enter duration in seconds"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingCountdown ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingTasks.length > 0 ? (
              <div className="space-y-4">
                {upcomingTasks.map(task => (
                  <div key={task.id} className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-slate-500">{format(new Date(task.date), 'MMM d, h:mm a')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-sm">No recent activity to display</p>
            )}
          </CardContent>
        </Card>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center"
            >
              <Link href="/study-time">
                <Clock className="h-5 w-5 mb-1" />
                <span>Study Timer</span>
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center"
            >
              <Link href="/subjects">
                <BookOpen className="h-5 w-5 mb-1" />
                <span>Add Subject</span>
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center"
            >
              <Link href="/flashbook">
                <FileText className="h-5 w-5 mb-1" />
                <span>Add Flashcard</span>
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="outline" 
              className="h-20 flex flex-col justify-center items-center"
            >
              <Link href="/planner">
                <Calendar className="h-5 w-5 mb-1" />
                <span>Add Task</span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
