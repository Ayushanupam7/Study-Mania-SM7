import { useState, useEffect } from 'react';
import { useRoute } from 'wouter';
import { useStudyContext } from '@/context/StudyContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { formatStudyTime } from '@/lib/utils';
import { format } from 'date-fns';
import { 
  BookOpen, 
  Clock, 
  History, 
  Save, 
  FileText, 
  Calendar, 
  PieChart,
  Check
} from 'lucide-react';

// Helper function to get subject notes from localStorage
const getSubjectNotes = (subjectId: number): string => {
  try {
    const notes = localStorage.getItem(`subject_notes_${subjectId}`);
    return notes || '';
  } catch (error) {
    console.error("Error loading subject notes:", error);
    return '';
  }
};

// Helper function to save subject notes to localStorage
const saveSubjectNotes = (subjectId: number, notes: string) => {
  try {
    localStorage.setItem(`subject_notes_${subjectId}`, notes);
  } catch (error) {
    console.error("Error saving subject notes:", error);
  }
};

const SubjectDetail = () => {
  const [, params] = useRoute('/subjects/:id');
  const subjectId = params ? parseInt(params.id) : null;
  
  const { subjects, studySessions, flashcards, plannerItems } = useStudyContext();
  const [notes, setNotes] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find the current subject by ID
  const subject = subjects.find(s => s.id === subjectId);
  
  // Get all study sessions for this subject
  const subjectSessions = studySessions.filter(session => session.subjectId === subjectId);
  
  // Calculate total study time for this subject
  const totalStudyTime = subjectSessions.reduce((total, session) => total + session.duration, 0);
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...subjectSessions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get flashcards for this subject
  const subjectFlashcards = flashcards.filter(fc => fc.subjectId === subjectId);
  
  // Get planner items for this subject
  const subjectPlannerItems = plannerItems.filter(item => item.subjectId === subjectId);
  
  // Sort planner items by date
  const sortedPlannerItems = [...subjectPlannerItems].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Load notes from localStorage when component mounts
  useEffect(() => {
    if (subjectId) {
      const savedNotes = getSubjectNotes(subjectId);
      setNotes(savedNotes);
    }
  }, [subjectId]);
  
  // Handle saving notes
  const handleSaveNotes = () => {
    if (subjectId) {
      saveSubjectNotes(subjectId, notes);
      setIsSaved(true);
      
      // Reset saved indicator after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    }
  };
  
  // If subject doesn't exist, show an error message
  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-4">Subject Not Found</h2>
        <p className="text-slate-600 mb-6">The subject you're looking for doesn't exist or has been deleted.</p>
        <Button asChild>
          <a href="/subjects">Back to Subjects</a>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <div className="flex-1 min-w-0">
          <h1 className={`text-2xl font-semibold mb-1 ${subject.colorClass.replace('border', 'text')}`}>
            {subject.name}
          </h1>
          <p className="text-slate-600 text-sm truncate">{subject.description}</p>
        </div>
        <div className="flex flex-col items-end ml-4">
          <div className="flex items-center gap-2 py-1 px-3 bg-blue-50 text-blue-700 rounded-lg mb-1">
            <Clock className="h-4 w-4" />
            <div className="text-lg font-medium">
              {formatStudyTime(totalStudyTime)}
            </div>
          </div>
          <div className="text-xs text-slate-600 flex items-center gap-1">
            <History className="h-3 w-3" /> {subjectSessions.length} Study Sessions
          </div>
        </div>
      </div>
      
      {/* Progress metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-slideUp" style={{ animationDelay: '100ms' }}>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Last session</h3>
            <Clock className="h-4 w-4 text-slate-400" />
          </div>
          {sortedSessions.length > 0 ? (
            <div className="mt-2">
              <div className="text-lg font-medium">
                {formatStudyTime(sortedSessions[0].duration)}
              </div>
              <p className="text-xs text-slate-500">
                {format(new Date(sortedSessions[0].date), 'MMMM d, yyyy')}
              </p>
            </div>
          ) : (
            <p className="text-sm italic text-slate-400 mt-2">No sessions yet</p>
          )}
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Completion rate</h3>
            <Check className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-medium">
              {subjectPlannerItems.length > 0
                ? `${Math.round((subjectPlannerItems.filter(item => item.isCompleted).length / subjectPlannerItems.length) * 100)}%`
                : '0%'
              }
            </div>
            <p className="text-xs text-slate-500">
              {subjectPlannerItems.filter(item => item.isCompleted).length} of {subjectPlannerItems.length} tasks completed
            </p>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-slate-500">Flashcards</h3>
            <BookOpen className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2">
            <div className="text-lg font-medium">
              {subjectFlashcards.length}
            </div>
            <p className="text-xs text-slate-500">
              {subjectFlashcards.length === 1 ? 'Flashcard' : 'Flashcards'} created
            </p>
          </div>
        </div>
      </div>
      
      <Tabs 
        defaultValue="overview" 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <PieChart className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Study Sessions
          </TabsTrigger>
          <TabsTrigger value="flashcards" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            Flashcards
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Study Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatStudyTime(totalStudyTime)}</div>
                <p className="text-xs text-muted-foreground">Total time spent studying</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Flashcards</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjectFlashcards.length}</div>
                <p className="text-xs text-muted-foreground">Flashcards for this subject</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasks</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjectPlannerItems.length}</div>
                <p className="text-xs text-muted-foreground">
                  {subjectPlannerItems.filter(item => !item.isCompleted).length} pending tasks
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                asChild
                variant="outline" 
                className="h-20 flex flex-col justify-center items-center"
              >
                <a href="/study-time">
                  <Clock className="h-5 w-5 mb-1" />
                  <span>Start Studying</span>
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="h-20 flex flex-col justify-center items-center"
              >
                <a href="/flashbook">
                  <BookOpen className="h-5 w-5 mb-1" />
                  <span>Add Flashcard</span>
                </a>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                className="h-20 flex flex-col justify-center items-center"
              >
                <a href="/planner">
                  <Calendar className="h-5 w-5 mb-1" />
                  <span>Add Task</span>
                </a>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col justify-center items-center"
                onClick={() => setActiveTab('notes')}
              >
                <FileText className="h-5 w-5 mb-1" />
                <span>Take Notes</span>
              </Button>
            </CardContent>
          </Card>
          
          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedSessions.length > 0 || sortedPlannerItems.some(item => item.isCompleted) ? (
                <div className="space-y-4">
                  {sortedSessions.slice(0, 3).map(session => (
                    <div key={session.id} className="flex items-start">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                      <div>
                        <p className="font-medium text-sm">Studied for {formatStudyTime(session.duration)}</p>
                        <p className="text-xs text-slate-500">{format(new Date(session.date), 'MMM d, h:mm a')}</p>
                      </div>
                    </div>
                  ))}
                  
                  {sortedPlannerItems
                    .filter(item => item.isCompleted)
                    .slice(0, 3)
                    .map(item => (
                      <div key={item.id} className="flex items-start">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                        <div>
                          <p className="font-medium text-sm">Completed: {item.title}</p>
                          <p className="text-xs text-slate-500">{format(new Date(item.date), 'MMM d, h:mm a')}</p>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No recent activity for this subject</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notes Tab */}
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Subject Notes</CardTitle>
                <Button 
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={handleSaveNotes}
                >
                  <Save className="h-4 w-4" />
                  {isSaved ? 'Saved!' : 'Save Notes'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Take notes about this subject here. What are you learning? What's difficult? What do you need to review more?"
                className="min-h-[300px] resize-y"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Study Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Study Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {sortedSessions.length > 0 ? (
                <div className="space-y-6">
                  {sortedSessions.map(session => (
                    <div key={session.id} className="border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-center mb-2">
                        <div className="font-medium">{format(new Date(session.date), 'MMMM d, yyyy')}</div>
                        <div className="text-sm font-semibold text-blue-600">{formatStudyTime(session.duration)}</div>
                      </div>
                      <div className="text-xs text-slate-500 mb-1">{format(new Date(session.date), 'h:mm a')}</div>
                      {session.comments ? (
                        <div className="bg-slate-50 p-3 rounded-md mt-2">
                          <p className="text-sm">{session.comments}</p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">No comments for this session</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <History className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Study Sessions Yet</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    You haven't recorded any study sessions for this subject.
                  </p>
                  <Button asChild>
                    <a href="/study-time">Start Studying</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Flashcards Tab */}
        <TabsContent value="flashcards">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Flashcards</CardTitle>
                <Button asChild>
                  <a href="/flashbook">Add Flashcard</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subjectFlashcards.length > 0 ? (
                <div className="space-y-4">
                  {subjectFlashcards.map(flashcard => (
                    <div key={flashcard.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                      <div className="border-b border-slate-200 p-4 bg-slate-50">
                        <p className="font-medium">{flashcard.question}</p>
                      </div>
                      <div className="p-4">
                        <p className="text-slate-700">{flashcard.answer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Flashcards Yet</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    You haven't created any flashcards for this subject.
                  </p>
                  <Button asChild>
                    <a href="/flashbook">Create Flashcard</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Tasks</CardTitle>
                <Button asChild>
                  <a href="/planner">Add Task</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {subjectPlannerItems.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-600">Pending Tasks</h3>
                  <div className="space-y-2">
                    {subjectPlannerItems
                      .filter(item => !item.isCompleted)
                      .map(item => (
                        <div key={item.id} className="flex items-center p-3 border border-slate-200 rounded-lg">
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 mr-3"></div>
                          <div className="flex-1">
                            <p className="font-medium">{item.title}</p>
                            {item.description && <p className="text-sm text-slate-500">{item.description}</p>}
                            <p className="text-xs text-slate-400 mt-1">Due: {format(new Date(item.date), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                      ))}
                    
                    {subjectPlannerItems.filter(item => !item.isCompleted).length === 0 && (
                      <p className="text-sm text-slate-500 italic">No pending tasks</p>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-slate-600 mt-6">Completed Tasks</h3>
                  <div className="space-y-2">
                    {subjectPlannerItems
                      .filter(item => item.isCompleted)
                      .map(item => (
                        <div key={item.id} className="flex items-center p-3 border border-slate-200 rounded-lg bg-slate-50">
                          <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center mr-3">
                            <Check className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium line-through text-slate-500">{item.title}</p>
                            {item.description && <p className="text-sm text-slate-400 line-through">{item.description}</p>}
                            <p className="text-xs text-slate-400 mt-1">Completed on {format(new Date(item.date), 'MMM d, yyyy')}</p>
                          </div>
                        </div>
                      ))}
                    
                    {subjectPlannerItems.filter(item => item.isCompleted).length === 0 && (
                      <p className="text-sm text-slate-500 italic">No completed tasks</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Tasks Yet</h3>
                  <p className="text-slate-500 text-sm mb-4">
                    You haven't created any tasks for this subject.
                  </p>
                  <Button asChild>
                    <a href="/planner">Create Task</a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SubjectDetail;