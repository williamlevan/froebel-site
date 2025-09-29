import clientPromise from './mongodb';
import { NextRequest } from 'next/server';

export interface SessionData {
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export class SessionManager {
  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static async createSession(userData: SessionData): Promise<string> {
    const sessionId = this.generateSessionId();
    const client = await clientPromise;
    const db = client.db('sessions');
    const sessions = db.collection('sessions');
    
    await sessions.insertOne({
      sessionId,
      userData,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    return sessionId;
  }

  static async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const client = await clientPromise;
      const db = client.db('sessions');
      const sessions = db.collection('sessions');
      
      const session = await sessions.findOne({
        sessionId,
        expiresAt: { $gt: new Date() }
      });
      
      return session ? session.userData : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async extendSession(sessionId: string): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db('sessions');
      const sessions = db.collection('sessions');
      
      await sessions.updateOne(
        { sessionId },
        { 
          $set: { 
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          } 
        }
      );
    } catch (error) {
      console.error('Error extending session:', error);
    }
  }

  static async deleteSession(sessionId: string): Promise<void> {
    try {
      const client = await clientPromise;
      const db = client.db('sessions');
      const sessions = db.collection('sessions');
      
      await sessions.deleteOne({ sessionId });
    } catch (error) {
      console.error('Error deleting session:', error);
    }
  }
}
