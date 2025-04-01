import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useStudyContext } from '@/context/StudyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Clock, BookOpen, FileText, Calendar } from 'lucide-react';
import { formatStudyTime } from '@/lib/utils';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
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
