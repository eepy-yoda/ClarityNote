import { api } from '../lib/api';
import type { Notebook, Note, AppEvent } from '../models/types';

export const ApiService = {
  activateNotebook: async (code: string): Promise<Notebook> => {
    console.log('[activateNotebook] sending code:', code);
    const { data } = await api.post('/notebooks/activate', { activation_code: code });
    console.log('[activateNotebook] response:', data);
    return data;
  },
  getNotebooks: async (): Promise<Notebook[]> => {
    const { data } = await api.get('/notebooks/');
    console.log('[getNotebooks] response:', data);
    return data;
  },
  getNotes: async (notebookId: string): Promise<Note[]> => {
    const { data } = await api.get(`/notes/notebook/${notebookId}`);
    return data;
  },
  getAllNotes: async (): Promise<Note[]> => {
    const { data } = await api.get('/notes/all');
    return data;
  },
  deleteNote: async (noteId: string): Promise<void> => {
    await api.delete(`/notes/${noteId}`);
  },
  uploadNote: async (notebookId: string, title: string, file: File): Promise<Note> => {
    const formData = new FormData();
    formData.append('notebook_id', notebookId);
    formData.append('title', title);
    formData.append('file', file);
    const { data } = await api.post('/notes/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
  getEvents: async (): Promise<AppEvent[]> => {
    const { data } = await api.get('/events/');
    return data;
  },
  processNote: async (file: File): Promise<{ raw_text: string; clean_text: string; pdf_url: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    const { data } = await api.post('/ai/process-note', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};
