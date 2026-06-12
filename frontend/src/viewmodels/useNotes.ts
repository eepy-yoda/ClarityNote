import { useState, useEffect } from 'react';
import type { Notebook, Note } from '../models/types';
import { ApiService } from '../services/api_service';

export function useNotes() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNotebooks = async () => {
    setLoading(true);
    try {
      const data = await ApiService.getNotebooks();
      setNotebooks(data);
    } catch (e) {
      console.error("Failed to fetch notebooks", e);
    }
    setLoading(false);
  };

  const fetchNotes = async (notebookId: string) => {
    setLoading(true);
    try {
      const data = await ApiService.getNotes(notebookId);
      setNotes(data);
    } catch (e) {
      console.error("Failed to fetch notes", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNotebooks();
  }, []);

  return {
    notebooks,
    notes,
    loading,
    fetchNotes,
    fetchNotebooks
  };
}
