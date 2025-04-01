import { db } from './db';
import { users, subjects, flashcards, plannerItems, studySessions } from '@shared/schema';
import { log } from './vite';
import { eq } from 'drizzle-orm';

async function copyData() {
  try {
    // Check if default user exists
    const existingUser = await db.select().from(users).where(eq(users.username, 'defaultuser')).limit(1);
    
    if (existingUser.length === 0) {
      log('Creating default user...');
      
      // Create default user
      const [user] = await db.insert(users).values({
        username: 'defaultuser',
        password: 'password123', // In a real app, this would be hashed
        name: 'Student',
        appColor: '#4f46e5',
        isDarkMode: false,
      }).returning();
      
      log('Creating default subjects...');
      
      // Create default subjects
      const [mathSubject] = await db.insert(subjects).values({
        name: 'Mathematics',
        description: 'Algebra, Calculus, and Geometry',
        colorClass: 'blue',
        totalStudyTime: 7200, // 2 hours in seconds
        userId: user.id,
      }).returning();
      
      const [physicsSubject] = await db.insert(subjects).values({
        name: 'Physics',
        description: 'Mechanics, Thermodynamics, and Electromagnetism',
        colorClass: 'green',
        totalStudyTime: 3600, // 1 hour in seconds
        userId: user.id,
      }).returning();
      
      const [csSubject] = await db.insert(subjects).values({
        name: 'Computer Science',
        description: 'Programming, Algorithms, and Data Structures',
        colorClass: 'purple',
        totalStudyTime: 5400, // 1.5 hours in seconds
        userId: user.id,
      }).returning();
      
      log('Creating default flashcards...');
      
      // Create default flashcards
      await db.insert(flashcards).values([
        {
          question: 'What is the quadratic formula?',
          answer: 'x = (-b ± √(b² - 4ac)) / 2a',
          subjectId: mathSubject.id,
          userId: user.id,
        },
        {
          question: 'What is Newton\'s second law of motion?',
          answer: 'F = ma (Force equals mass times acceleration)',
          subjectId: physicsSubject.id,
          userId: user.id,
        },
      ]);
      
      log('Creating default planner items...');
      
      // Create default planner items
      await db.insert(plannerItems).values([
        {
          title: 'Complete Math Homework',
          description: 'Exercises 1-10 from Chapter 5',
          date: new Date(new Date().setDate(new Date().getDate() + 1)), // Tomorrow
          isCompleted: false,
          subjectId: mathSubject.id,
          userId: user.id,
        },
        {
          title: 'Physics Lab Report',
          description: 'Write up results from the pendulum experiment',
          date: new Date(new Date().setDate(new Date().getDate() + 3)), // 3 days from now
          isCompleted: false,
          subjectId: physicsSubject.id,
          userId: user.id,
        },
      ]);
      
      log('Creating default study sessions...');
      
      // Create default study sessions
      await db.insert(studySessions).values([
        {
          subjectId: mathSubject.id,
          userId: user.id,
          date: new Date(new Date().setDate(new Date().getDate() - 1)), // Yesterday
          duration: 3600, // 1 hour in seconds
          comments: 'Reviewed calculus concepts',
        },
      ]);
      
      log('Default data created successfully!');
      return true;
    } else {
      log('Default data already exists. Skipping initialization.');
      return true;
    }
  } catch (error) {
    console.error('Error creating default data:', error);
    return false;
  }
}

export async function main() {
  log('Checking database...');
  
  // Check if tables exist
  try {
    const result = await copyData();
    return result;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}