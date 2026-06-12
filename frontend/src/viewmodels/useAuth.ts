import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../models/types';

// Sync current user to the localStorage users list (seeding with default mock users if empty)
const syncUserToLocalStorage = (email: string) => {
  if (!email) return;
  const stored = localStorage.getItem('clarity_users');
  let usersList = stored ? JSON.parse(stored) : [];
  
  if (usersList.length === 0) {
    usersList = [
      { name: 'Jane Doe', email: 'jane@example.com' },
      { name: 'John Smith', email: 'john@example.com' },
      { name: 'Admin User', email: 'tsmeowtsmeow@gmail.com' },
    ];
  }
  
  const exists = usersList.some((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!exists) {
    usersList.push({
      name: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email: email,
    });
  }
  
  localStorage.setItem('clarity_users', JSON.stringify(usersList));
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        syncUserToLocalStorage(session.user.email || '');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' });
        syncUserToLocalStorage(session.user.email || '');
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { user, loading, logout };
}
