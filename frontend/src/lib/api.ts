import axios from 'axios';
import { supabase } from './supabase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
});

// REQUEST interceptor — attach token, refresh only when actually expired
api.interceptors.request.use(async (config) => {
  let { data: { session } } = await supabase.auth.getSession();

  // If token is expired (or about to in <60s), refresh it
  if (session) {
    const expiresAt = session.expires_at ?? 0;
    const nowSec = Math.floor(Date.now() / 1000);
    if (expiresAt - nowSec < 60) {
      const { data } = await supabase.auth.refreshSession();
      session = data.session;
    }
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
  }

  return config;
}, (error) => Promise.reject(error));

// RESPONSE interceptor — on true 401, sign out cleanly
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn('[api] 401 — session invalid, signing out');
      await supabase.auth.signOut();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
