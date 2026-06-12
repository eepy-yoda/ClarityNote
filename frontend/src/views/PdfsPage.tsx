import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Search, FileX } from 'lucide-react';
import { ApiService } from '../services/api_service';
import type { Note } from '../models/types';

export const PdfsPage: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const all = await ApiService.getAllNotes();
      // Only keep notes that have a pdf_url
      setNotes(all.filter(n => n.pdf_url));
    } catch (e) {
      console.error('[PdfsPage] failed to fetch notes', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotes(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce PDF ?')) return;
    try {
      await ApiService.deleteNote(id);
      setNotes(prev => prev.filter(n => n.id !== id));
    } catch (e) {
      console.error('[PdfsPage] delete failed', e);
    }
  };

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase())
  );

  const getPdfHref = (pdf_url: string) => {
    // Local PDF served by FastAPI static files
    if (pdf_url.startsWith('/static')) return `http://localhost:8000${pdf_url}`;
    // Supabase storage URL — file was never actually uploaded, unusable
    if (pdf_url.includes('supabase.co')) return null;
    return pdf_url;
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' });

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-2 leading-tight">
          PDF Générés
        </h1>
        <p className="text-clarity-muted text-lg font-medium">
          Téléchargez et gérez vos documents convertis
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-clarity-beige shadow-soft flex items-center gap-3 px-5 py-4">
        <Search className="w-5 h-5 text-clarity-muted flex-shrink-0" />
        <input
          type="text"
          placeholder="Rechercher des PDF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-clarity-darkBrown placeholder:text-clarity-muted/60 font-medium text-base"
        />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="w-12 h-12 border-4 border-clarity-beige border-t-clarity-brown rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <div className="bg-clarity-beige/30 p-8 rounded-full mb-6">
            <FileX className="w-14 h-14 text-clarity-brown opacity-30" />
          </div>
          <h3 className="text-2xl font-bold text-clarity-darkBrown mb-2">Aucun PDF trouvé</h3>
          <p className="text-clarity-muted font-medium max-w-sm">
            {search ? 'Aucun résultat pour cette recherche.' : 'Téléchargez une note pour générer votre premier PDF.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(note => (
            <div
              key={note.id}
              className="bg-white rounded-[2rem] border border-clarity-beige/60 shadow-soft p-7 flex flex-col gap-4 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Icon + title */}
              <div className="flex items-start gap-4">
                <div className="bg-clarity-beige/40 p-4 rounded-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <FileText className="w-7 h-7 text-clarity-brown" />
                </div>
                <div className="overflow-hidden">
                  <h3 className="font-bold text-clarity-darkBrown text-base leading-snug line-clamp-2">
                    {note.title}
                  </h3>
                  <p className="text-clarity-muted text-sm mt-1">{formatDate(note.created_at)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto pt-2">
                {getPdfHref(note.pdf_url!) ? (
                  <a
                    href={getPdfHref(note.pdf_url!)!}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-clarity-brown text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-clarity-darkBrown transition-all text-sm shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </a>
                ) : (
                  <span className="flex-1 bg-clarity-beige/50 text-clarity-muted font-bold py-3 rounded-2xl flex items-center justify-center gap-2 text-sm cursor-not-allowed">
                    <Download className="w-4 h-4" />
                    Non disponible
                  </span>
                )}
                <button
                  onClick={() => handleDelete(note.id)}
                  className="bg-red-50 border border-red-200 text-red-500 p-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all active:scale-95"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
