import { eq, and, desc } from 'drizzle-orm';
import { db } from './db';
import { IStorage } from './storage';
import {
  users,
  subjects,
  flashcards,
  plannerItems,
  studySessions,
  User,
  Subject,
  Flashcard,
  PlannerItem,
  StudySession,
  InsertUser,
  InsertSubject,
  InsertFlashcard,
  InsertPlannerItem,
  InsertStudySession
} from '@shared/schema';

export class PgStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id));
    return results[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username));
    return results[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const results = await db.insert(users).values(user).returning();
    return results[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const results = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return results[0];
  }

  async getDefaultUser(): Promise<User | undefined> {
    const results = await db.select().from(users).limit(1);
    return results[0];
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async getSubject(id: number): Promise<Subject | undefined> {
    const results = await db.select().from(subjects).where(eq(subjects.id, id));
    return results[0];
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const results = await db.insert(subjects).values({
      ...subject,
      totalStudyTime: 0,
      description: subject.description ?? null,
      colorClass: subject.colorClass ?? null
    }).returning();
    
    return results[0];
  }

  async updateSubject(id: number, subjectData: Partial<Subject>): Promise<Subject | undefined> {
    const results = await db
      .update(subjects)
      .set(subjectData)
      .where(eq(subjects.id, id))
      .returning();
    
    return results[0];
  }

  async deleteSubject(id: number): Promise<void> {
    // Delete associated records first
    await db.delete(flashcards).where(eq(flashcards.subjectId, id));
    await db.delete(plannerItems).where(eq(plannerItems.subjectId, id));
    await db.delete(studySessions).where(eq(studySessions.subjectId, id));
    
    // Then delete the subject
    await db.delete(subjects).where(eq(subjects.id, id));
  }

  async incrementSubjectStudyTime(id: number, duration: number): Promise<Subject | undefined> {
    const subject = await this.getSubject(id);
    if (!subject) return undefined;
    
    const currentStudyTime = subject.totalStudyTime ?? 0;
    
    const results = await db
      .update(subjects)
      .set({ totalStudyTime: currentStudyTime + duration })
      .where(eq(subjects.id, id))
      .returning();
    
    return results[0];
  }

  // Flashcard operations
  async getFlashcards(): Promise<Flashcard[]> {
    return await db.select().from(flashcards);
  }

  async getFlashcard(id: number): Promise<Flashcard | undefined> {
    const results = await db.select().from(flashcards).where(eq(flashcards.id, id));
    return results[0];
  }

  async getFlashcardsBySubject(subjectId: number): Promise<Flashcard[]> {
    return await db.select().from(flashcards).where(eq(flashcards.subjectId, subjectId));
  }

  async createFlashcard(flashcard: InsertFlashcard): Promise<Flashcard> {
    const results = await db.insert(flashcards).values(flashcard).returning();
    return results[0];
  }

  async updateFlashcard(id: number, flashcardData: Partial<Flashcard>): Promise<Flashcard | undefined> {
    const results = await db
      .update(flashcards)
      .set(flashcardData)
      .where(eq(flashcards.id, id))
      .returning();
    
    return results[0];
  }

  async deleteFlashcard(id: number): Promise<void> {
    await db.delete(flashcards).where(eq(flashcards.id, id));
  }

  // Planner Item operations
  async getPlannerItems(): Promise<PlannerItem[]> {
    return await db.select().from(plannerItems);
  }

  async getPlannerItem(id: number): Promise<PlannerItem | undefined> {
    const results = await db.select().from(plannerItems).where(eq(plannerItems.id, id));
    return results[0];
  }

  async getPlannerItemsByDate(date: Date): Promise<PlannerItem[]> {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // We need to filter by date in application code because of the date handling differences
    const allItems = await db.select().from(plannerItems);
    
    return allItems.filter(item => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === year &&
        itemDate.getMonth() === month &&
        itemDate.getDate() === day
      );
    });
  }

  async createPlannerItem(plannerItem: InsertPlannerItem): Promise<PlannerItem> {
    const results = await db.insert(plannerItems).values({
      ...plannerItem,
      description: plannerItem.description ?? null,
      subjectId: plannerItem.subjectId ?? null,
      isCompleted: plannerItem.isCompleted ?? null
    }).returning();
    
    return results[0];
  }

  async updatePlannerItem(id: number, plannerItemData: Partial<PlannerItem>): Promise<PlannerItem | undefined> {
    const results = await db
      .update(plannerItems)
      .set(plannerItemData)
      .where(eq(plannerItems.id, id))
      .returning();
    
    return results[0];
  }

  async deletePlannerItem(id: number): Promise<void> {
    await db.delete(plannerItems).where(eq(plannerItems.id, id));
  }

  // Study Session operations
  async getStudySessions(): Promise<StudySession[]> {
    return await db.select().from(studySessions);
  }

  async getStudySession(id: number): Promise<StudySession | undefined> {
    const results = await db.select().from(studySessions).where(eq(studySessions.id, id));
    return results[0];
  }

  async getStudySessionsBySubject(subjectId: number): Promise<StudySession[]> {
    return await db.select().from(studySessions).where(eq(studySessions.subjectId, subjectId));
  }

  async getStudySessionsByDate(date: Date): Promise<StudySession[]> {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    // We need to filter by date in application code because of the date handling differences
    const allSessions = await db.select().from(studySessions);
    
    return allSessions.filter(session => {
      const sessionDate = new Date(session.date);
      return (
        sessionDate.getFullYear() === year &&
        sessionDate.getMonth() === month &&
        sessionDate.getDate() === day
      );
    });
  }

  async createStudySession(studySession: InsertStudySession): Promise<StudySession> {
    const results = await db.insert(studySessions).values({
      ...studySession,
      comments: studySession.comments ?? null
    }).returning();
    
    return results[0];
  }

  async updateStudySession(id: number, sessionData: Partial<StudySession>): Promise<StudySession | undefined> {
    const results = await db
      .update(studySessions)
      .set(sessionData)
      .where(eq(studySessions.id, id))
      .returning();
    
    return results[0];
  }

  async deleteStudySession(id: number): Promise<void> {
    // Get the session before deleting to update subject's study time
    const session = await this.getStudySession(id);
    
    if (session) {
      // Decrement the subject's total study time
      const subject = await this.getSubject(session.subjectId);
      
      if (subject) {
        const currentStudyTime = subject.totalStudyTime ?? 0;
        const updatedStudyTime = Math.max(0, currentStudyTime - session.duration);
        
        await this.updateSubject(subject.id, { totalStudyTime: updatedStudyTime });
      }
      
      // Delete the session
      await db.delete(studySessions).where(eq(studySessions.id, id));
    }
  }
}