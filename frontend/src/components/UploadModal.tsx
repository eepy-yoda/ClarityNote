import React, { useState } from 'react';
import { X, UploadCloud, Loader2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => Promise<void>;
}

export const UploadModal: React.FC<Props> = ({ isOpen, onClose, onUpload }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return;
    
    setIsUploading(true);
    try {
      await onUpload(title, file);
      setTitle('');
      setFile(null);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-clarity-darkBrown transition-colors">
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-clarity-darkBrown mb-6">Upload Notes</h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-clarity-darkBrown mb-1">Document Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-clarity-beige focus:outline-none focus:ring-2 focus:ring-clarity-brown bg-clarity-paper transition-all"
              placeholder="E.g., Week 1 Physics"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-clarity-darkBrown mb-1">Image or Scan</label>
            <label className="border-2 border-dashed border-clarity-lightBrown rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-clarity-beige/30 transition-colors">
              <UploadCloud className="w-10 h-10 text-clarity-brown mb-2" />
              <span className="text-sm font-medium text-clarity-brown">{file ? file.name : "Click to select a file"}</span>
              <input type="file" required accept="image/*" className="hidden" onChange={e => e.target.files && setFile(e.target.files[0])} />
            </label>
          </div>
          
          <button 
            type="submit" 
            disabled={isUploading || !file || !title}
            className="w-full bg-clarity-brown text-white font-semibold py-3 rounded-xl hover:bg-clarity-darkBrown transition-all mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2">
            {isUploading ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing AI OCR...</> : 'Upload & Process'}
          </button>
        </form>
      </div>
    </div>
  );
};
