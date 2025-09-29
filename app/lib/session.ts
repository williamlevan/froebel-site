import { createClient } from 'redis';
import { NextRequest } from 'next/server';

const redis = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

redis.on('error', (err) => console.error('Redis Client Error', err));
redis.connect();

export interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export class SessionManager {
  private static generateSessionId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  static async createSession(userData: SessionData): Promise<string> {
    const sessionId = this.generateSessionId();
    const sessionKey = `session:${sessionId}`;
    
    await redis.setEx(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(userData)); // 7 days
    return sessionId;
  }

  static async getSession(sessionId: string): Promise<SessionData | null> {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await redis.get(sessionKey);
      return sessionData ? JSON.parse(sessionData) : null;
    } catch (error) {
      console.error('Error getting session:', error);
      return null;
    }
  }

  static async updateSession(sessionId: string, userData: Partial<SessionData>): Promise<boolean> {
    try {
      const sessionKey = `session:${sessionId}`;
      const existingData = await this.getSession(sessionId);
      
      if (!existingData) return false;
      
      const updatedData = { ...existingData, ...userData };
      await redis.setEx(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(updatedData));
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  static async deleteSession(sessionId: string): Promise<boolean> {
    try {
      const sessionKey = `session:${sessionId}`;
      await redis.del(sessionKey);
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  static async extendSession(sessionId: string): Promise<boolean> {
    try {
      const sessionKey = `session:${sessionId}`;
      const sessionData = await this.getSession(sessionId);
      
      if (!sessionData) return false;
      
      await redis.setEx(sessionKey, 7 * 24 * 60 * 60, JSON.stringify(sessionData));
      return true;
    } catch (error) {
      console.error('Error extending session:', error);
      return false;
    }
  }
}
