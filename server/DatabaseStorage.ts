import { 
  users, subjects, flashcards, plannerItems, studySessions,
  type User, type InsertUser, type Subject, type InsertSubject,
  type Flashcard, type InsertFlashcard, type PlannerItem, type InsertPlannerItem,
  type StudySession, type InsertStudySession
} from '@shared/schema';
import { IStorage } from './storage';
import { db } from './db';
import { eq, and, desc, sql } from 'drizzle-orm';

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [updatedUser] = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async updateDarkMode(id: number, isDarkMode: boolean): Promise<User | undefined> {
    return this.updateUser(id, { isDarkMode });
  }

  async getDefaultUser(): Promise<User | undefined> {
    // Get the first user in the database (our default user for now)
    const [user] = await db.select().from(users).limit(1);
    return user;
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return db.select().from(subjects).orderBy(subjects.name);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const [subject] = await db.select().from(subjects).where(eq(subjects.id, id));
    return subject;
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  async updateSubject(id: number, subjectData: Partial<Subject>): Promise<Subject | undefined> {
    const [updatedSubject] = await db.update(subjects)
      .set(subjectData)
      .where(eq(subjects.id, id))
      .returning();
    return updatedSubject;
  }

  async deleteSubject(id: number): Promise<void> {
    await db.delete(subjects).where(eq(subjects.id, id));
  }

  async incrementSubjectStudyTime(id: number, duration: number): Promise<Subject | undefined> {
    const [updatedSubject] = await db.update(subjects)
      .set({
        totalStudyTime: sql`${subjects.totalStudyTime} + ${duration}`
      })
      .where(eq(subjects.id, id))
      .returning();
    return updatedSubject;
  }

  // Flashcard operations
  async getFlashcards(): Promise<Flashcard[]> {
    return db.select().from(flashcards);
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const [flashcard] = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return flashcard;
  }

  async getFlashcardsBySubject(subjectId: number): Promise<Flashcard[]> {
    return db.select()
      .from(flashcards)
      .where(eq(flashcards.subjectId, subjectId));
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const [newFlashcard] = await db.insert(flashcards).values(flashcard).returning();
    return newFlashcard;
  }

  async updateFlashcard(id: number, flashcardData: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const [updatedFlashcard] = await db.update(flashcards)
      .set(flashcardData)
      .where(eq(flashcards.id, id))
      .returning();
    return updatedFlashcard;
  }

  async deleteFlashcard(id: number): Promise<void> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  }

  // Planner Item operations
  async getPlannerItems(): Promise<PlannerItem[]> {
    return db.select()
      .from(plannerItems)
      .orderBy(plannerItems.date);
  }

  async getPlannerItem(id: number): Promise<PlannerItem | undefined> {
    const [plannerItem] = await db.select().from(plannerItems).where(eq(plannerItems.id, id));
    return plannerItem;
  }

  async getPlannerItemsByDate(date: Date): Promise<PlannerItem[]> {
    // Format the date to get just the date part (not the time)
    const dateStr = date.toISOString().split('T')[0];
    
    return db.select()
      .from(plannerItems)
      .where(sql`DATE(${plannerItems.date}) = DATE(${dateStr})`)
      .orderBy(plannerItems.date);
  }

  async createPlannerItem(plannerItem: InsertPlannerItem): Promise<PlannerItem> {
    const [newPlannerItem] = await db.insert(plannerItems).values(plannerItem).returning();
    return newPlannerItem;
  }

  async updatePlannerItem(id: number, plannerItemData: Partial<PlannerItem>): Promise<PlannerItem | undefined> {
    const [updatedPlannerItem] = await db.update(plannerItems)
      .set(plannerItemData)
      .where(eq(plannerItems.id, id))
      .returning();
    return updatedPlannerItem;
  }

  async deletePlannerItem(id: number): Promise<void> {
    await db.delete(plannerItems).where(eq(plannerItems.id, id));
  }

  // Study Session operations
  async getStudySessions(): Promise<StudySession[]> {
    return db.select()
      .from(studySessions)
      .orderBy(desc(studySessions.date));
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    const [studySession] = await db.select().from(studySessions).where(eq(studySessions.id, id));
    return studySession;
  }

  async getStudySessionsBySubject(subjectId: number): Promise<StudySession[]> {
    return db.select()
      .from(studySessions)
      .where(eq(studySessions.subjectId, subjectId))
      .orderBy(desc(studySessions.date));
  }

  async getStudySessionsByDate(date: Date): Promise<StudySession[]> {
    // Format the date to get just the date part (not the time)
    const dateStr = date.toISOString().split('T')[0];
    
    return db.select()
      .from(studySessions)
      .where(sql`DATE(${studySessions.date}) = DATE(${dateStr})`)
      .orderBy(desc(studySessions.date));
  }

  async createStudySession(studySession: InsertStudySession): Promise<StudySession> {
    const [newStudySession] = await db.insert(studySessions).values(studySession).returning();
    return newStudySession;
  }

  async updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined> {
    const [updatedStudySession] = await db.update(studySessions)
      .set(sessionData)
      .where(eq(studySessions.id, id))
      .returning();
    return updatedStudySession;
  }

  async deleteStudySession(id: number): Promise<void> {
    await db.delete(studySessions).where(eq(studySessions.id, id));
  }
}