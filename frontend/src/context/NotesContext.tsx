import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Note, Notebook } from '../models/types';
import { ApiService } from '../services/api_service';

interface NotesContextType {
  notes: Note[];
  notebooks: Notebook[];
  loading: boolean;
  fetchAll: () => Promise<void>;
  addNote: (note: Note) => void;
}

const NotesContext = createContext<NotesContextType>({
  notes: [],
  notebooks: [],
  loading: true,
  fetchAll: async () => {},
  addNote: () => {},
});

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [nbs, nts] = await Promise.all([
        ApiService.getNotebooks(),
        ApiService.getAllNotes(),
      ]);
      setNotebooks(nbs);
      setNotes(nts);
    } catch (e) {
      console.error('[NotesContext] fetchAll error', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const addNote = useCallback((note: Note) => {
    setNotes(prev => [note, ...prev]);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return (
    <NotesContext.Provider value={{ notes, notebooks, loading, fetchAll, addNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => useContext(NotesContext);
