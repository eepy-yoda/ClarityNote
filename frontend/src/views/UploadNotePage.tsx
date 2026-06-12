import React, { useState, useRef } from 'react';
import {
  UploadCloud, Camera, CheckCircle, Loader2, Sparkles, Download, RefreshCw, FileText,
} from 'lucide-react';
import { CameraModal } from '../components/CameraModal';
import { ApiService } from '../services/api_service';
import { useNotesContext } from '../context/NotesContext';

export const UploadNotePage: React.FC = () => {
  const { fetchAll } = useNotesContext();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'raw' | 'clean'>('clean');
  const [results, setResults] = useState<{
    raw_text: string;
    clean_text: string;
    pdf_url: string;
  } | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setResults(null);
      setSaved(false);
      setError(null);
    }
  };

  const handleCapture = (cameraFile: File) => {
    setFile(cameraFile);
    setPreview(URL.createObjectURL(cameraFile));
    setResults(null);
    setSaved(false);
    setError(null);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    setSaved(false);
    try {
      const data = await ApiService.processNote(file);
      setResults(data);
      setActiveTab('clean');
      setSaved(true);
      // Refresh global notes list so Dashboard shows the new note instantly
      await fetchAll();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Erreur lors du traitement. Réessayez.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResults(null);
    setSaved(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getPdfHref = (pdf_url: string) => {
    if (pdf_url.startsWith('/static')) return `http://localhost:8000${pdf_url}`;
    return null;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-2 leading-tight">
          Télécharger une Note
        </h1>
        <p className="text-clarity-muted text-xl font-medium">
          Prenez une photo ou importez une image — l'IA fait le reste
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left — Upload */}
        <div className="space-y-6">
          <div className="bg-clarity-card p-10 rounded-[3rem] shadow-soft border border-clarity-beige/50 space-y-6">
            <h2 className="text-2xl font-bold text-clarity-darkBrown">Image de la note</h2>

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-4 border-dashed border-clarity-beige rounded-[2.5rem] overflow-hidden cursor-pointer hover:bg-clarity-bg/40 transition-all hover:border-clarity-brown group"
              style={{ minHeight: 220 }}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              {preview ? (
                <img src={preview} alt="aperçu" className="w-full h-64 object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center py-14 px-8 text-center">
                  <div className="bg-clarity-beige/30 p-6 rounded-full mb-5 group-hover:scale-110 transition-transform">
                    <UploadCloud className="w-12 h-12 text-clarity-brown" />
                  </div>
                  <p className="text-lg font-bold text-clarity-darkBrown">
                    Déposez votre image ici ou <span className="text-clarity-brown underline">parcourez</span>
                  </p>
                  <p className="text-clarity-muted text-sm mt-2">JPG, PNG, HEIC acceptés</p>
                </div>
              )}
            </div>

            {/* Camera button */}
            <button
              onClick={() => setIsCameraOpen(true)}
              className="w-full bg-white border-2 border-clarity-beige px-8 py-4 rounded-2xl font-bold text-clarity-darkBrown flex items-center justify-center gap-3 hover:bg-clarity-bg transition-all shadow-sm"
            >
              <Camera className="w-6 h-6 text-clarity-brown" />
              Prendre une photo
            </button>

            {/* File ready indicator */}
            {file && !isProcessing && !results && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-5 py-3 rounded-2xl font-bold text-sm">
                <CheckCircle className="w-5 h-5" />
                Fichier prêt : {file.name}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-5 py-3 rounded-2xl text-sm font-medium">
                {error}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              disabled={!file || isProcessing}
              onClick={handleProcess}
              className="flex-1 bg-clarity-brown text-white font-extrabold py-5 rounded-[2rem] text-lg shadow-xl hover:bg-clarity-darkBrown transition-all disabled:opacity-30 flex items-center justify-center gap-3 active:scale-95"
            >
              {isProcessing
                ? <><Loader2 className="w-6 h-6 animate-spin" /> Traitement en cours...</>
                : <><Sparkles className="w-6 h-6" /> Générer le document</>
              }
            </button>
            {(file || results) && (
              <button
                onClick={handleReset}
                className="bg-white border-2 border-clarity-beige text-clarity-muted px-5 rounded-[2rem] hover:bg-clarity-bg transition-all"
                title="Réinitialiser"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Right — Result */}
        <div className="bg-clarity-card p-10 rounded-[3.5rem] shadow-soft border border-clarity-beige/50 flex flex-col gap-6 min-h-[500px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-3xl font-extrabold text-clarity-darkBrown font-serif">Résultat IA</h2>
            {results && (
              <div className="flex bg-clarity-bg rounded-xl p-1 border border-clarity-beige">
                <button
                  onClick={() => setActiveTab('raw')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'raw' ? 'bg-white shadow-sm text-clarity-darkBrown' : 'text-clarity-muted'}`}
                >Brut</button>
                <button
                  onClick={() => setActiveTab('clean')}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'clean' ? 'bg-white shadow-sm text-clarity-brown' : 'text-clarity-muted'}`}
                >Amélioré IA</button>
              </div>
            )}
          </div>

          <div className="flex-1 bg-clarity-bg/20 rounded-[2rem] p-8 border border-dashed border-clarity-beige flex flex-col">
            {isProcessing ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-16 h-16 text-clarity-brown animate-spin opacity-50" />
                <p className="text-clarity-brown font-extrabold animate-pulse uppercase tracking-widest">Traitement IA...</p>
              </div>
            ) : results ? (
              <div className="text-clarity-darkBrown font-medium text-base leading-relaxed whitespace-pre-line italic">
                {activeTab === 'raw' ? results.raw_text : results.clean_text}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <div className="bg-clarity-beige/30 p-8 rounded-full">
                  <Sparkles className="w-14 h-14 text-clarity-muted opacity-40" />
                </div>
                <p className="text-clarity-muted font-medium max-w-xs leading-relaxed">
                  Importez une image et cliquez sur <span className="text-clarity-brown font-bold">"Générer le document"</span>
                </p>
              </div>
            )}
          </div>

          {/* Success + Download */}
          {results && saved && (
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 px-5 py-3 rounded-2xl font-bold text-sm">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                Document généré et sauvegardé avec succès !
              </div>
              {getPdfHref(results.pdf_url) && (
                <a
                  href={getPdfHref(results.pdf_url)!}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-clarity-brown text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-clarity-darkBrown transition-all shadow-md active:scale-95"
                >
                  <Download className="w-5 h-5" />
                  Télécharger le PDF
                </a>
              )}
              <button
                onClick={handleReset}
                className="w-full border-2 border-clarity-beige text-clarity-brown font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-clarity-beige transition-all"
              >
                <FileText className="w-5 h-5" />
                Traiter une autre note
              </button>
            </div>
          )}
        </div>
      </div>

      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </div>
  );
};
