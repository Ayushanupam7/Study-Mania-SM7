import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertSubjectSchema, insertFlashcardSchema, insertPlannerItemSchema, insertStudySessionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // User routes
  app.get('/api/user', async (req, res) => {
    try {
      // For now, just return a default user
      const user = await storage.getDefaultUser();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user' });
    }
  });

  app.patch('/api/user', async (req, res) => {
    try {
      const userData = req.body;
      const updatedUser = await storage.updateUser(1, userData);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: 'Error updating user' });
    }
  });

  // Subject routes
  app.get('/api/subjects', async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching subjects' });
    }
  });

  app.post('/api/subjects', async (req, res) => {
    try {
      const subjectData = req.body;
      const parseResult = insertSubjectSchema.safeParse({ ...subjectData, userId: 1 });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid subject data', errors: parseResult.error.errors });
      }
      
      const newSubject = await storage.createSubject(parseResult.data);
      res.status(201).json(newSubject);
    } catch (error) {
      res.status(500).json({ message: 'Error creating subject' });
    }
  });

  app.patch('/api/subjects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const subjectData = req.body;
      
      const updatedSubject = await storage.updateSubject(id, subjectData);
      if (!updatedSubject) {
        return res.status(404).json({ message: 'Subject not found' });
      }
      
      res.json(updatedSubject);
    } catch (error) {
      res.status(500).json({ message: 'Error updating subject' });
    }
  });

  app.delete('/api/subjects/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSubject(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting subject' });
    }
  });

  // Flashcard routes
  app.get('/api/flashcards', async (req, res) => {
    try {
      const flashcards = await storage.getFlashcards();
      res.json(flashcards);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching flashcards' });
    }
  });

  app.post('/api/flashcards', async (req, res) => {
    try {
      const flashcardData = req.body;
      const parseResult = insertFlashcardSchema.safeParse({ ...flashcardData, userId: 1 });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid flashcard data', errors: parseResult.error.errors });
      }
      
      const newFlashcard = await storage.createFlashcard(parseResult.data);
      res.status(201).json(newFlashcard);
    } catch (error) {
      res.status(500).json({ message: 'Error creating flashcard' });
    }
  });

  app.patch('/api/flashcards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const flashcardData = req.body;
      
      const updatedFlashcard = await storage.updateFlashcard(id, flashcardData);
      if (!updatedFlashcard) {
        return res.status(404).json({ message: 'Flashcard not found' });
      }
      
      res.json(updatedFlashcard);
    } catch (error) {
      res.status(500).json({ message: 'Error updating flashcard' });
    }
  });

  app.delete('/api/flashcards/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFlashcard(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting flashcard' });
    }
  });

  // Planner Item routes
  app.get('/api/planner', async (req, res) => {
    try {
      const plannerItems = await storage.getPlannerItems();
      res.json(plannerItems);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching planner items' });
    }
  });

  app.post('/api/planner', async (req, res) => {
    try {
      const plannerItemData = req.body;
      const parseResult = insertPlannerItemSchema.safeParse({ 
        ...plannerItemData,
        date: new Date(plannerItemData.date), 
        userId: 1 
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid planner item data', errors: parseResult.error.errors });
      }
      
      const newPlannerItem = await storage.createPlannerItem(parseResult.data);
      res.status(201).json(newPlannerItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating planner item' });
    }
  });

  app.patch('/api/planner/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const plannerItemData = req.body;
      
      const updatedPlannerItem = await storage.updatePlannerItem(id, plannerItemData);
      if (!updatedPlannerItem) {
        return res.status(404).json({ message: 'Planner item not found' });
      }
      
      res.json(updatedPlannerItem);
    } catch (error) {
      res.status(500).json({ message: 'Error updating planner item' });
    }
  });

  app.delete('/api/planner/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePlannerItem(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting planner item' });
    }
  });

  // Study Session routes
  app.get('/api/study-sessions', async (req, res) => {
    try {
      const studySessions = await storage.getStudySessions();
      res.json(studySessions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching study sessions' });
    }
  });

  app.post('/api/study-sessions', async (req, res) => {
    try {
      const sessionData = req.body;
      const parseResult = insertStudySessionSchema.safeParse({ 
        ...sessionData,
        date: new Date(sessionData.date), 
        userId: 1 
      });
      
      if (!parseResult.success) {
        return res.status(400).json({ message: 'Invalid study session data', errors: parseResult.error.errors });
      }
      
      const newSession = await storage.createStudySession(parseResult.data);
      
      // Update the subject's total study time
      await storage.incrementSubjectStudyTime(newSession.subjectId, newSession.duration);
      
      res.status(201).json(newSession);
    } catch (error) {
      res.status(500).json({ message: 'Error recording study session' });
    }
  });

  // Add route to update a study session
  app.patch('/api/study-sessions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const sessionData = req.body;
      
      // Get the original session to check for duration changes
      const originalSession = await storage.getStudySession(id);
      if (!originalSession) {
        return res.status(404).json({ message: 'Study session not found' });
      }
      
      // If duration is being updated, adjust the subject's total study time
      if (sessionData.duration && sessionData.duration !== originalSession.duration) {
        const durationDifference = sessionData.duration - originalSession.duration;
        await storage.incrementSubjectStudyTime(originalSession.subjectId, durationDifference);
      }
      
      // Convert date string to Date object if provided
      if (sessionData.date) {
        sessionData.date = new Date(sessionData.date);
      }
      
      const updatedSession = await storage.updateStudySession(id, sessionData);
      res.json(updatedSession);
    } catch (error) {
      res.status(500).json({ message: 'Error updating study session' });
    }
  });

  // Add route to delete a study session
  app.delete('/api/study-sessions/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteStudySession(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting study session' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
