import React, { useState } from 'react';
import { useNotesContext } from '../context/NotesContext';
import { DocumentCard } from '../components/DocumentCard';
import { ApiService } from '../services/api_service';
import { FileText, Book, Clock, Plus, QrCode, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { notes, loading, fetchAll } = useNotesContext();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activating, setActivating] = useState(false);

  const thisWeekCount = notes.filter(n => {
    const d = new Date(n.created_at);
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= weekAgo;
  }).length;

  const pdfCount = notes.filter(n => n.pdf_url).length;

  const activate = async () => {
    if (!code.trim()) return;
    setError(null);
    setSuccess(null);
    setActivating(true);
    try {
      await ApiService.activateNotebook(code.trim());
      await fetchAll();
      setCode('');
      setSuccess('Cahier activé avec succès !');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Échec de l'activation. Vérifiez votre code.");
    } finally {
      setActivating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') activate();
  };

  // Skeleton card
  const SkeletonCard = () => (
    <div className="bg-clarity-card rounded-[2rem] overflow-hidden border border-clarity-beige animate-pulse">
      <div className="bg-clarity-beige/40 h-48" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-clarity-beige/60 rounded-full w-3/4" />
        <div className="h-3 bg-clarity-beige/40 rounded-full w-1/2" />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-2 leading-tight">
            Mes Notes
          </h1>
          <p className="text-clarity-muted text-lg font-medium">
            Consultez et gérez vos notes manuscrites
          </p>
        </div>
        {/* QR Activate */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-white pt-1 pb-1 pl-4 pr-1 rounded-full shadow-soft border border-clarity-beige focus-within:ring-2 focus-within:ring-clarity-brown transition-all">
            <input
              type="text"
              placeholder="Code QR..."
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent border-none focus:outline-none px-2 text-sm text-clarity-darkBrown placeholder:text-clarity-muted/50 w-32"
            />
            <button
              onClick={activate}
              disabled={activating}
              className="bg-clarity-beige text-clarity-brown px-4 py-2 rounded-full hover:bg-clarity-brown hover:text-white transition-all flex items-center gap-2 text-sm font-bold shadow-sm whitespace-nowrap disabled:opacity-50"
            >
              <QrCode className="w-4 h-4" /> Activer
            </button>
          </div>
          {success && <p className="text-green-600 text-xs font-bold">{success}</p>}
          {error && (
            <p className="text-red-500 text-xs font-bold max-w-xs text-right">{error}</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: FileText, label: 'Total des Notes', value: loading ? '—' : notes.length },
          { icon: Book, label: 'PDF Générés', value: loading ? '—' : pdfCount },
          { icon: Clock, label: 'Cette Semaine', value: loading ? '—' : thisWeekCount },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-clarity-card p-8 rounded-[2rem] shadow-soft flex items-center justify-between border border-clarity-beige/50 group hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-5">
              <div className="bg-clarity-beige/30 p-4 rounded-2xl group-hover:scale-110 transition-transform">
                <Icon className="w-8 h-8 text-clarity-brown" />
              </div>
              <span className="font-bold text-clarity-darkBrown text-lg">{label}</span>
            </div>
            <span className="text-5xl font-extrabold text-clarity-darkBrown">{value}</span>
          </div>
        ))}
      </div>

      {/* Notes section */}
      <div className="bg-clarity-card rounded-[3rem] p-10 shadow-soft border border-clarity-beige/30 min-h-[400px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-clarity-darkBrown leading-tight">Notes Récentes</h2>
            <div className="h-1 w-12 bg-clarity-brown mt-2 rounded-full" />
          </div>
          <button
            onClick={() => navigate('/upload')}
            className="bg-clarity-brown text-white px-6 py-2.5 rounded-2xl font-bold shadow-md hover:bg-clarity-darkBrown transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Nouvelle Note
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
            <div className="bg-clarity-beige/20 w-24 h-24 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-12 h-12 text-clarity-brown opacity-20" />
            </div>
            <h3 className="text-2xl font-bold text-clarity-darkBrown mb-3">Aucune note encore</h3>
            <p className="text-clarity-muted max-w-sm mb-6 font-medium">
              Téléchargez votre première note manuscrite et l'IA la transformera en document structuré.
            </p>
            <button
              onClick={() => navigate('/upload')}
              className="bg-clarity-brown text-white px-8 py-3 rounded-2xl font-bold hover:bg-clarity-darkBrown transition-all shadow-md"
            >
              Télécharger une Note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {notes.map(note => (
              <DocumentCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
