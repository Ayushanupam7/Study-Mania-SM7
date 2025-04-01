import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { useLocation, useRoute } from 'wouter';
import { formatStudyTime } from '@/lib/utils';

// Types
type User = {
  id: number;
  name: string;
};

type Subject = {
  id: number;
  name: string;
  description: string;
  colorClass: string;
  totalStudyTime: number;
};

type Flashcard = {
  id: number;
  question: string;
  answer: string;
  subjectId: number;
};

type PlannerItem = {
  id: number;
  title: string;
  description: string;
  date: Date;
  isCompleted: boolean;
  subjectId: number | null;
};

type StudySession = {
  id: number;
  subjectId: number;
  date: Date;
  duration: number;
  comments: string | null;
};

type StudyContextType = {
  // User
  user: User | null;
  updateUser: (userData: { name: string }) => void;
  
  // Subjects
  subjects: Subject[];
  subjectsCount: number;
  createSubject: (subjectData: Omit<Subject, 'id' | 'totalStudyTime'>) => void;
  updateSubject: (id: number, subjectData: { name: string; description: string }) => void;
  deleteSubject: (id: number) => void;
  
  // Flashcards
  flashcards: Flashcard[];
  flashcardsCount: number;
  createFlashcard: (flashcardData: Omit<Flashcard, 'id'>) => void;
  updateFlashcard: (id: number, flashcardData: Omit<Flashcard, 'id'>) => void;
  deleteFlashcard: (id: number) => void;
  
  // Planner
  plannerItems: PlannerItem[];
  plannerItemsCount: number;
  createPlannerItem: (plannerItemData: Omit<PlannerItem, 'id'>) => void;
  updatePlannerItem: (id: number, plannerItemData: Partial<Omit<PlannerItem, 'id' | 'date'>>) => void;
  deletePlannerItem: (id: number) => void;
  
  // Study Sessions
  studySessions: StudySession[];
  recordStudySession: (subjectId: number, duration: number, comments?: string) => void;
  updateStudySession: (id: number, sessionData: Partial<Omit<StudySession, 'id'>>) => void;
  deleteStudySession: (id: number) => void;
  getTotalStudyTime: () => number;
  getTotalStudyTimeForToday: () => number;
  
  // App Settings
  appColor: string;
  setAppColor: (color: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  
  // Utility functions for the floating action button
  createTimer: () => void;
  createStopwatch: () => void;
  createCountdown: () => void;
  createFlashcardFromFAB: () => void;
  createSubjectFromFAB: () => void;
  createPlannerItemFromFAB: () => void;
};

// Create context
const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Provider component
export const StudyProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>({ id: 1, name: 'Ayush' });
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: 1, name: 'Mathematics', description: 'Algebra, Calculus, and Geometry', colorClass: 'border-blue-500', totalStudyTime: 5 },
    { id: 2, name: 'Physics', description: 'Mechanics, Electricity, and Thermodynamics', colorClass: 'border-yellow-500', totalStudyTime: 0 },
    { id: 3, name: 'Computer Science', description: 'Programming, Algorithms, and Data Structures', colorClass: 'border-green-500', totalStudyTime: 0 }
  ]);
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([
    { id: 1, question: 'What is the quadratic formula?', answer: 'x = (-b ± √(b² - 4ac)) / 2a', subjectId: 1 },
    { id: 2, question: 'What is Newton\'s Second Law?', answer: 'F = ma', subjectId: 2 }
  ]);
  
  const [plannerItems, setPlannerItems] = useState<PlannerItem[]>([
    { 
      id: 1, 
      title: 'Complete Math Homework', 
      description: 'Problems 1-10 from Chapter 5', 
      date: new Date(2025, 3, 2, 12, 15), 
      isCompleted: false,
      subjectId: 1
    },
    { 
      id: 2, 
      title: 'Study Session - Mathematics', 
      description: 'Completed 0h 0m 5s of study', 
      date: new Date(2025, 3, 2, 12, 18), 
      isCompleted: true,
      subjectId: 1
    },
    { 
      id: 3, 
      title: 'Study Data Structures', 
      description: 'Focus on Hash Tables and Binary Trees', 
      date: new Date(2025, 3, 3, 12, 15), 
      isCompleted: false,
      subjectId: 3
    }
  ]);
  
  const [studySessions, setStudySessions] = useState<StudySession[]>([
    { id: 1, subjectId: 1, date: new Date(2025, 3, 2), duration: 5, comments: null }
  ]);
  
  const [appColor, setAppColor] = useState('blue');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Fetch data from API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await apiRequest('GET', '/api/user', undefined);
        const userData = await userResponse.json();
        if (userData) {
          setUser(userData);
        }

        // Fetch subjects
        const subjectsResponse = await apiRequest('GET', '/api/subjects', undefined);
        const subjectsData = await subjectsResponse.json();
        if (subjectsData) {
          setSubjects(subjectsData);
        }

        // Fetch flashcards
        const flashcardsResponse = await apiRequest('GET', '/api/flashcards', undefined);
        const flashcardsData = await flashcardsResponse.json();
        if (flashcardsData) {
          setFlashcards(flashcardsData);
        }

        // Fetch planner items
        const plannerResponse = await apiRequest('GET', '/api/planner', undefined);
        const plannerData = await plannerResponse.json();
        if (plannerData) {
          setPlannerItems(plannerData.map((item: any) => ({
            ...item,
            date: new Date(item.date)
          })));
        }

        // Fetch study sessions
        const sessionsResponse = await apiRequest('GET', '/api/study-sessions', undefined);
        const sessionsData = await sessionsResponse.json();
        if (sessionsData) {
          setStudySessions(sessionsData.map((session: any) => ({
            ...session,
            date: new Date(session.date)
          })));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Keep using the initial state if the API calls fail
      }
    };

    fetchData();
  }, []);

  // User functions
  const updateUser = async (userData: { name: string }) => {
    try {
      const response = await apiRequest('PATCH', '/api/user', userData);
      const updatedUser = await response.json();
      setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      // Update local state anyway for better UX
      setUser(prev => prev ? { ...prev, ...userData } : null);
    }
  };

  // Subject functions
  const createSubject = async (subjectData: Omit<Subject, 'id' | 'totalStudyTime'>) => {
    try {
      const response = await apiRequest('POST', '/api/subjects', subjectData);
      const newSubject = await response.json();
      setSubjects(prev => [...prev, newSubject]);
      toast({
        title: "Subject created",
        description: `Subject "${subjectData.name}" has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      // Add to local state anyway for better UX
      const newId = Math.max(0, ...subjects.map(s => s.id)) + 1;
      const newSubject = { ...subjectData, id: newId, totalStudyTime: 0 };
      setSubjects(prev => [...prev, newSubject]);
    }
  };

  const updateSubject = async (id: number, subjectData: { name: string; description: string }) => {
    try {
      const response = await apiRequest('PATCH', `/api/subjects/${id}`, subjectData);
      const updatedSubject = await response.json();
      setSubjects(prev => prev.map(subject => 
        subject.id === id ? { ...subject, ...updatedSubject } : subject
      ));
      toast({
        title: "Subject updated",
        description: `Subject "${subjectData.name}" has been updated successfully.`
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      // Update local state anyway for better UX
      setSubjects(prev => prev.map(subject => 
        subject.id === id ? { ...subject, ...subjectData } : subject
      ));
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/subjects/${id}`, undefined);
      setSubjects(prev => prev.filter(subject => subject.id !== id));
      // Also delete associated flashcards, planner items and study sessions
      setFlashcards(prev => prev.filter(flashcard => flashcard.subjectId !== id));
      setPlannerItems(prev => prev.filter(item => item.subjectId !== id));
      setStudySessions(prev => prev.filter(session => session.subjectId !== id));
      toast({
        title: "Subject deleted",
        description: "The subject has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      // Delete from local state anyway for better UX
      setSubjects(prev => prev.filter(subject => subject.id !== id));
    }
  };

  // Flashcard functions
  const createFlashcard = async (flashcardData: Omit<Flashcard, 'id'>) => {
    try {
      const response = await apiRequest('POST', '/api/flashcards', flashcardData);
      const newFlashcard = await response.json();
      setFlashcards(prev => [...prev, newFlashcard]);
      toast({
        title: "Flashcard created",
        description: "Your flashcard has been created successfully."
      });
    } catch (error) {
      console.error('Error creating flashcard:', error);
      // Add to local state anyway for better UX
      const newId = Math.max(0, ...flashcards.map(f => f.id)) + 1;
      setFlashcards(prev => [...prev, { ...flashcardData, id: newId }]);
    }
  };

  const updateFlashcard = async (id: number, flashcardData: Omit<Flashcard, 'id'>) => {
    try {
      const response = await apiRequest('PATCH', `/api/flashcards/${id}`, flashcardData);
      const updatedFlashcard = await response.json();
      setFlashcards(prev => prev.map(flashcard => 
        flashcard.id === id ? { ...flashcard, ...updatedFlashcard } : flashcard
      ));
      toast({
        title: "Flashcard updated",
        description: "Your flashcard has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating flashcard:', error);
      // Update local state anyway for better UX
      setFlashcards(prev => prev.map(flashcard => 
        flashcard.id === id ? { ...flashcard, ...flashcardData } : flashcard
      ));
    }
  };

  const deleteFlashcard = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/flashcards/${id}`, undefined);
      setFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
      toast({
        title: "Flashcard deleted",
        description: "The flashcard has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      // Delete from local state anyway for better UX
      setFlashcards(prev => prev.filter(flashcard => flashcard.id !== id));
    }
  };

  // Planner functions
  const createPlannerItem = async (plannerItemData: Omit<PlannerItem, 'id'>) => {
    try {
      const serializedData = {
        ...plannerItemData,
        date: plannerItemData.date.toISOString(),
      };
      const response = await apiRequest('POST', '/api/planner', serializedData);
      const newItem = await response.json();
      setPlannerItems(prev => [...prev, {
        ...newItem,
        date: new Date(newItem.date)
      }]);
      toast({
        title: "Task created",
        description: `Task "${plannerItemData.title}" has been created successfully.`
      });
    } catch (error) {
      console.error('Error creating planner item:', error);
      // Add to local state anyway for better UX
      const newId = Math.max(0, ...plannerItems.map(p => p.id)) + 1;
      setPlannerItems(prev => [...prev, { ...plannerItemData, id: newId }]);
    }
  };

  const updatePlannerItem = async (id: number, plannerItemData: Partial<Omit<PlannerItem, 'id' | 'date'>>) => {
    try {
      const response = await apiRequest('PATCH', `/api/planner/${id}`, plannerItemData);
      const updatedItem = await response.json();
      setPlannerItems(prev => prev.map(item => 
        item.id === id ? { 
          ...item, 
          ...updatedItem,
          date: updatedItem.date ? new Date(updatedItem.date) : item.date
        } : item
      ));
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating planner item:', error);
      // Update local state anyway for better UX
      setPlannerItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...plannerItemData } : item
      ));
    }
  };

  const deletePlannerItem = async (id: number) => {
    try {
      await apiRequest('DELETE', `/api/planner/${id}`, undefined);
      setPlannerItems(prev => prev.filter(item => item.id !== id));
      toast({
        title: "Task deleted",
        description: "The task has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting planner item:', error);
      // Delete from local state anyway for better UX
      setPlannerItems(prev => prev.filter(item => item.id !== id));
    }
  };

  // Study session functions
  const recordStudySession = async (subjectId: number, duration: number, comments?: string) => {
    console.log("recordStudySession called with:", {subjectId, duration, comments});
    
    const sessionData = {
      subjectId,
      duration,
      date: new Date(),
      comments: comments || null
    };
    
    console.log("Session data:", sessionData);
    
    try {
      const serializedData = {
        ...sessionData,
        date: sessionData.date.toISOString(),
      };
      
      console.log("Serialized data to send:", serializedData);
      console.log("Making API request to POST /api/study-sessions");
      
      const response = await apiRequest('POST', '/api/study-sessions', serializedData);
      const newSession = await response.json();
      
      console.log("Response from server:", newSession);
      
      setStudySessions(prev => {
        console.log("Current study sessions:", prev);
        const updated = [...prev, {
          ...newSession,
          date: new Date(newSession.date)
        }];
        console.log("Updated study sessions:", updated);
        return updated;
      });
      
      // Update subject's total study time
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, totalStudyTime: subject.totalStudyTime + duration }
          : subject
      ));
      
      toast({
        title: "Study session recorded",
        description: `You studied for ${formatStudyTime(duration)}.`
      });
    } catch (error) {
      console.error('Error recording study session:', error);
      
      // Add to local state anyway for better UX
      const newId = Math.max(0, ...studySessions.map(s => s.id)) + 1;
      console.log("Created local session with ID:", newId);
      
      setStudySessions(prev => {
        const updated = [...prev, { ...sessionData, id: newId }];
        console.log("Updated study sessions with local data:", updated);
        return updated;
      });
      
      // Update subject's total study time in local state
      setSubjects(prev => prev.map(subject => 
        subject.id === subjectId
          ? { ...subject, totalStudyTime: subject.totalStudyTime + duration }
          : subject
      ));
      
      toast({
        title: "Study session recorded locally",
        description: `You studied for ${formatStudyTime(duration)}. The server couldn't be reached, but the session was saved locally.`
      });
    }
  };

  const updateStudySession = async (id: number, sessionData: Partial<Omit<StudySession, 'id'>>) => {
    try {
      // Get the current session to check duration changes
      const currentSession = studySessions.find(session => session.id === id);
      if (!currentSession) {
        toast({
          title: "Error",
          description: "Study session not found",
          variant: "destructive"
        });
        return;
      }

      // Prepare data for API call
      const serializedData: any = { ...sessionData };
      
      // Convert date to ISO string if provided
      if (serializedData.date) {
        serializedData.date = serializedData.date.toISOString();
      }
      
      const response = await apiRequest('PATCH', `/api/study-sessions/${id}`, serializedData);
      const updatedSession = await response.json();
      
      // Update sessions in state
      setStudySessions(prev => prev.map(session => 
        session.id === id ? { 
          ...session, 
          ...updatedSession,
          date: new Date(updatedSession.date) 
        } : session
      ));
      
      // If duration was changed, update the subject's total study time
      if (sessionData.duration && sessionData.duration !== currentSession.duration) {
        const durationDifference = sessionData.duration - currentSession.duration;
        setSubjects(prev => prev.map(subject => 
          subject.id === currentSession.subjectId
            ? { 
                ...subject, 
                totalStudyTime: subject.totalStudyTime + durationDifference 
              }
            : subject
        ));
      }
      
      toast({
        title: "Study session updated",
        description: "Your study session has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating study session:', error);
      // Update local state anyway for better UX
      setStudySessions(prev => prev.map(session => 
        session.id === id ? { ...session, ...sessionData } : session
      ));
      
      toast({
        title: "Study session updated",
        description: "Your study session has been updated in local state."
      });
    }
  };

  const deleteStudySession = async (id: number) => {
    try {
      // Get the session before deletion to update subject's study time
      const sessionToDelete = studySessions.find(session => session.id === id);
      if (!sessionToDelete) {
        toast({
          title: "Error",
          description: "Study session not found",
          variant: "destructive"
        });
        return;
      }
      
      await apiRequest('DELETE', `/api/study-sessions/${id}`, undefined);
      
      // Remove the session from state
      setStudySessions(prev => prev.filter(session => session.id !== id));
      
      // Update subject's total study time
      setSubjects(prev => prev.map(subject => 
        subject.id === sessionToDelete.subjectId
          ? { 
              ...subject, 
              totalStudyTime: Math.max(0, subject.totalStudyTime - sessionToDelete.duration) 
            }
          : subject
      ));
      
      toast({
        title: "Study session deleted",
        description: "The study session has been deleted successfully."
      });
    } catch (error) {
      console.error('Error deleting study session:', error);
      // Delete from local state anyway for better UX
      setStudySessions(prev => prev.filter(session => session.id !== id));
      
      toast({
        title: "Study session deleted",
        description: "The study session has been deleted from local state."
      });
    }
  };

  // Utility functions
  const getTotalStudyTime = () => {
    return studySessions.reduce((total, session) => total + session.duration, 0);
  };

  const getTotalStudyTimeForToday = () => {
    const today = new Date();
    return studySessions
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getDate() === today.getDate() &&
          sessionDate.getMonth() === today.getMonth() &&
          sessionDate.getFullYear() === today.getFullYear()
        );
      })
      .reduce((total, session) => total + session.duration, 0);
  };

  // FAB Actions
  const createTimer = () => {
    setLocation('/study-time');
  };

  const createStopwatch = () => {
    setLocation('/study-time');
  };

  const createCountdown = () => {
    setLocation('/study-time');
  };

  const createFlashcardFromFAB = () => {
    setLocation('/flashbook');
  };

  const createSubjectFromFAB = () => {
    setLocation('/subjects');
  };

  const createPlannerItemFromFAB = () => {
    setLocation('/planner');
  };

  const contextValue: StudyContextType = {
    // User
    user,
    updateUser,
    
    // Subjects
    subjects,
    subjectsCount: subjects.length,
    createSubject,
    updateSubject,
    deleteSubject,
    
    // Flashcards
    flashcards,
    flashcardsCount: flashcards.length,
    createFlashcard,
    updateFlashcard,
    deleteFlashcard,
    
    // Planner
    plannerItems,
    plannerItemsCount: plannerItems.length,
    createPlannerItem,
    updatePlannerItem,
    deletePlannerItem,
    
    // Study Sessions
    studySessions,
    recordStudySession,
    updateStudySession,
    deleteStudySession,
    getTotalStudyTime,
    getTotalStudyTimeForToday,
    
    // App Settings
    appColor,
    setAppColor,
    isDarkMode,
    setIsDarkMode,
    
    // FAB Actions
    createTimer,
    createStopwatch,
    createCountdown,
    createFlashcardFromFAB,
    createSubjectFromFAB,
    createPlannerItemFromFAB
  };

  return (
    <StudyContext.Provider value={contextValue}>
      {children}
    </StudyContext.Provider>
  );
};

// Hook for using the context
export const useStudyContext = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudyContext must be used within a StudyProvider');
  }
  return context;
};
