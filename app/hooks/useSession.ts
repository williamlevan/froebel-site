'use client';

import { useState, useEffect } from 'react';

interface SessionData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function useSession() {
  const [user, setUser] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSession();
  }, []);

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching session:', error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' });
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return { user, loading, logout, refetch: fetchSession };
}
