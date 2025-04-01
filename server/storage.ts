import { 
  User, 
  InsertUser, 
  Subject, 
  InsertSubject, 
  Flashcard, 
  InsertFlashcard, 
  PlannerItem, 
  InsertPlannerItem, 
  StudySession, 
  InsertStudySession 
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  getDefaultUser(): Promise<User | undefined>;
  
  // Subject operations
  getSubjects(): Promise<Subject[]>;
  getSubject(id: number): Promise<Subject | undefined>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  updateSubject(id: number, subjectData: Partial<Subject>): Promise<Subject | undefined>;
  deleteSubject(id: number): Promise<void>;
  incrementSubjectStudyTime(id: number, duration: number): Promise<Subject | undefined>;
  
  // Flashcard operations
  getFlashcards(): Promise<Flashcard[]>;
  getFlashcard(id: number): Promise<Flashcard | undefined>;
  getFlashcardsBySubject(subjectId: number): Promise<Flashcard[]>;
  createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard>;
  updateFlashcard(id: number, flashcardData: Partial<Flashcard>): Promise<Flashcard | undefined>;
  deleteFlashcard(id: number): Promise<void>;
  
  // Planner Item operations
  getPlannerItems(): Promise<PlannerItem[]>;
  getPlannerItem(id: number): Promise<PlannerItem | undefined>;
  getPlannerItemsByDate(date: Date): Promise<PlannerItem[]>;
  createPlannerItem(plannerItem: InsertPlannerItem): Promise<PlannerItem>;
  updatePlannerItem(id: number, plannerItemData: Partial<PlannerItem>): Promise<PlannerItem | undefined>;
  deletePlannerItem(id: number): Promise<void>;
  
  // Study Session operations
  getStudySessions(): Promise<StudySession[]>;
  getStudySession(id: number): Promise<StudySession | undefined>;
  getStudySessionsBySubject(subjectId: number): Promise<StudySession[]>;
  getStudySessionsByDate(date: Date): Promise<StudySession[]>;
  createStudySession(studySession: InsertStudySession): Promise<StudySession>;
  updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined>;
  deleteStudySession(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private subjects: Map<number, Subject>;
  private flashcards: Map<number, Flashcard>;
  private plannerItems: Map<number, PlannerItem>;
  private studySessions: Map<number, StudySession>;
  private userIdCounter: number;
  private subjectIdCounter: number;
  private flashcardIdCounter: number;
  private plannerItemIdCounter: number;
  private studySessionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.subjects = new Map();
    this.flashcards = new Map();
    this.plannerItems = new Map();
    this.studySessions = new Map();
    
    this.userIdCounter = 1;
    this.subjectIdCounter = 1;
    this.flashcardIdCounter = 1;
    this.plannerItemIdCounter = 1;
    this.studySessionIdCounter = 1;
    
    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Create default user
    const defaultUser: User = {
      id: this.userIdCounter++,
      username: 'ayush',
      password: 'password123', // In a real app, this would be hashed
      name: 'Ayush',
      appColor: 'blue',
      isDarkMode: false
    };
    this.users.set(defaultUser.id, defaultUser);
    
    // Create default subjects
    const mathSubject: Subject = {
      id: this.subjectIdCounter++,
      name: 'Mathematics',
      description: 'Algebra, Calculus, and Geometry',
      colorClass: 'border-blue-500',
      totalStudyTime: 5,
      userId: defaultUser.id
    };
    this.subjects.set(mathSubject.id, mathSubject);
    
    const physicsSubject: Subject = {
      id: this.subjectIdCounter++,
      name: 'Physics',
      description: 'Mechanics, Electricity, and Thermodynamics',
      colorClass: 'border-yellow-500',
      totalStudyTime: 0,
      userId: defaultUser.id
    };
    this.subjects.set(physicsSubject.id, physicsSubject);
    
    const csSubject: Subject = {
      id: this.subjectIdCounter++,
      name: 'Computer Science',
      description: 'Programming, Algorithms, and Data Structures',
      colorClass: 'border-green-500',
      totalStudyTime: 0,
      userId: defaultUser.id
    };
    this.subjects.set(csSubject.id, csSubject);
    
    // Create default flashcards
    const flashcard1: Flashcard = {
      id: this.flashcardIdCounter++,
      question: 'What is the quadratic formula?',
      answer: 'x = (-b ± √(b² - 4ac)) / 2a',
      subjectId: mathSubject.id,
      userId: defaultUser.id
    };
    this.flashcards.set(flashcard1.id, flashcard1);
    
    const flashcard2: Flashcard = {
      id: this.flashcardIdCounter++,
      question: 'What is Newton\'s Second Law?',
      answer: 'F = ma',
      subjectId: physicsSubject.id,
      userId: defaultUser.id
    };
    this.flashcards.set(flashcard2.id, flashcard2);
    
    // Create default planner items
    const plannerItem1: PlannerItem = {
      id: this.plannerItemIdCounter++,
      title: 'Complete Math Homework',
      description: 'Problems 1-10 from Chapter 5',
      date: new Date(2025, 3, 2, 12, 15),
      isCompleted: false,
      subjectId: mathSubject.id,
      userId: defaultUser.id
    };
    this.plannerItems.set(plannerItem1.id, plannerItem1);
    
    const plannerItem2: PlannerItem = {
      id: this.plannerItemIdCounter++,
      title: 'Study Session - Mathematics',
      description: 'Completed 0h 0m 5s of study',
      date: new Date(2025, 3, 2, 12, 18),
      isCompleted: true,
      subjectId: mathSubject.id,
      userId: defaultUser.id
    };
    this.plannerItems.set(plannerItem2.id, plannerItem2);
    
    const plannerItem3: PlannerItem = {
      id: this.plannerItemIdCounter++,
      title: 'Study Data Structures',
      description: 'Focus on Hash Tables and Binary Trees',
      date: new Date(2025, 3, 3, 12, 15),
      isCompleted: false,
      subjectId: csSubject.id,
      userId: defaultUser.id
    };
    this.plannerItems.set(plannerItem3.id, plannerItem3);
    
    // Create default study session
    const studySession1: StudySession = {
      id: this.studySessionIdCounter++,
      subjectId: mathSubject.id,
      userId: defaultUser.id,
      date: new Date(2025, 3, 2),
      duration: 5,
      comments: null
    };
    this.studySessions.set(studySession1.id, studySession1);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    // Ensure required fields have default values if not provided
    const user: User = { 
      ...insertUser, 
      id,
      appColor: insertUser.appColor ?? null,
      isDarkMode: insertUser.isDarkMode ?? null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getDefaultUser(): Promise<User | undefined> {
    // Return the first user for now (in a real app, this would be based on auth)
    if (this.users.size > 0) {
      return this.users.get(1);
    }
    return undefined;
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return Array.from(this.subjects.values());
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    return this.subjects.get(id);
  }

  async createSubject(insertSubject: InsertSubject): Promise<Subject> {
    const id = this.subjectIdCounter++;
    const subject: Subject = { 
      ...insertSubject, 
      id, 
      totalStudyTime: 0,
      description: insertSubject.description ?? null,
      colorClass: insertSubject.colorClass ?? null
    };
    this.subjects.set(id, subject);
    return subject;
  }

  async updateSubject(id: number, subjectData: Partial<Subject>): Promise<Subject | undefined> {
    const subject = this.subjects.get(id);
    if (!subject) return undefined;
    
    const updatedSubject = { ...subject, ...subjectData };
    this.subjects.set(id, updatedSubject);
    return updatedSubject;
  }

  async deleteSubject(id: number): Promise<void> {
    this.subjects.delete(id);
    
    // Also delete associated flashcards, planner items, and study sessions
    const flashcardsToDelete = Array.from(this.flashcards.values())
      .filter(flashcard => flashcard.subjectId === id)
      .map(flashcard => flashcard.id);
    
    flashcardsToDelete.forEach(flashcardId => {
      this.flashcards.delete(flashcardId);
    });
    
    const plannerItemsToDelete = Array.from(this.plannerItems.values())
      .filter(item => item.subjectId === id)
      .map(item => item.id);
    
    plannerItemsToDelete.forEach(itemId => {
      this.plannerItems.delete(itemId);
    });
    
    const studySessionsToDelete = Array.from(this.studySessions.values())
      .filter(session => session.subjectId === id)
      .map(session => session.id);
    
    studySessionsToDelete.forEach(sessionId => {
      this.studySessions.delete(sessionId);
    });
  }

  async incrementSubjectStudyTime(id: number, duration: number): Promise<Subject | undefined> {
    const subject = this.subjects.get(id);
    if (!subject) return undefined;
    
    const currentStudyTime = subject.totalStudyTime ?? 0;
    const updatedSubject = { 
      ...subject, 
      totalStudyTime: currentStudyTime + duration 
    };
    this.subjects.set(id, updatedSubject);
    return updatedSubject;
  }

  // Flashcard operations
  async getFlashcards(): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values());
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    return this.flashcards.get(id);
  }

  async getFlashcardsBySubject(subjectId: number): Promise<Flashcard[]> {
    return Array.from(this.flashcards.values())
      .filter(flashcard => flashcard.subjectId === subjectId);
  }

  async createFlashcard(insertFlashcard: InsertFlashcard): Promise<Flashcard> {
    const id = this.flashcardIdCounter++;
    const flashcard: Flashcard = { ...insertFlashcard, id };
    this.flashcards.set(id, flashcard);
    return flashcard;
  }

  async updateFlashcard(id: number, flashcardData: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const flashcard = this.flashcards.get(id);
    if (!flashcard) return undefined;
    
    const updatedFlashcard = { ...flashcard, ...flashcardData };
    this.flashcards.set(id, updatedFlashcard);
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    this.flashcards.delete(id);
  }

  // Planner Item operations
  async getPlannerItems(): Promise<PlannerItem[]> {
    return Array.from(this.plannerItems.values());
  }

  async getPlannerItem(id: number): Promise<PlannerItem | undefined> {
    return this.plannerItems.get(id);
  }

  async getPlannerItemsByDate(date: Date): Promise<PlannerItem[]> {
    return Array.from(this.plannerItems.values())
      .filter(item => {
        const itemDate = new Date(item.date);
        return (
          itemDate.getFullYear() === date.getFullYear() &&
          itemDate.getMonth() === date.getMonth() &&
          itemDate.getDate() === date.getDate()
        );
      });
  }

  async createPlannerItem(insertPlannerItem: InsertPlannerItem): Promise<PlannerItem> {
    const id = this.plannerItemIdCounter++;
    const plannerItem: PlannerItem = { 
      ...insertPlannerItem, 
      id,
      description: insertPlannerItem.description ?? null,
      subjectId: insertPlannerItem.subjectId ?? null,
      isCompleted: insertPlannerItem.isCompleted ?? null
    };
    this.plannerItems.set(id, plannerItem);
    return plannerItem;
  }

  async updatePlannerItem(id: number, plannerItemData: Partial<PlannerItem>): Promise<PlannerItem | undefined> {
    const plannerItem = this.plannerItems.get(id);
    if (!plannerItem) return undefined;
    
    const updatedPlannerItem = { ...plannerItem, ...plannerItemData };
    this.plannerItems.set(id, updatedPlannerItem);
    return updatedPlannerItem;
  }

  async deletePlannerItem(id: number): Promise<void> {
    this.plannerItems.delete(id);
  }

  // Study Session operations
  async getStudySessions(): Promise<StudySession[]> {
    return Array.from(this.studySessions.values());
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    return this.studySessions.get(id);
  }

  async getStudySessionsBySubject(subjectId: number): Promise<StudySession[]> {
    return Array.from(this.studySessions.values())
      .filter(session => session.subjectId === subjectId);
  }

  async getStudySessionsByDate(date: Date): Promise<StudySession[]> {
    return Array.from(this.studySessions.values())
      .filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getFullYear() === date.getFullYear() &&
          sessionDate.getMonth() === date.getMonth() &&
          sessionDate.getDate() === date.getDate()
        );
      });
  }

  async createStudySession(insertStudySession: InsertStudySession): Promise<StudySession> {
    const id = this.studySessionIdCounter++;
    const studySession: StudySession = { 
      ...insertStudySession, 
      id,
      comments: insertStudySession.comments ?? null
    };
    this.studySessions.set(id, studySession);
    return studySession;
  }

  async updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined> {
    const studySession = this.studySessions.get(id);
    if (!studySession) return undefined;
    
    const updatedStudySession = { ...studySession, ...sessionData };
    this.studySessions.set(id, updatedStudySession);
    return updatedStudySession;
  }

  async deleteStudySession(id: number): Promise<void> {
    const session = this.studySessions.get(id);
    if (session) {
      // Decrement the subject's total study time
      const subject = this.subjects.get(session.subjectId);
      if (subject) {
        const currentStudyTime = subject.totalStudyTime ?? 0;
        const updatedStudyTime = Math.max(0, currentStudyTime - session.duration);
        const updatedSubject = { 
          ...subject, 
          totalStudyTime: updatedStudyTime
        };
        this.subjects.set(subject.id, updatedSubject);
      }
      
      // Delete the session
      this.studySessions.delete(id);
    }
  }
}

export const storage = new MemStorage();
