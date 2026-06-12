import React from 'react';
import type { Note } from '../models/types';

interface Props {
  note: Note;
}

export const DocumentCard: React.FC<Props> = ({ note }) => {
  return (
    <div className="bg-clarity-card rounded-[2rem] overflow-hidden shadow-soft hover:shadow-lg transition-all border border-clarity-beige group cursor-pointer flex flex-col">
      {/* Note Preview area */}
      <div className="bg-[#EFEBE6] h-48 flex items-center justify-center p-8">
        <div className="w-full h-full bg-white/50 rounded-lg shadow-inner flex items-center justify-center border border-white/30 backdrop-blur-sm">
          {/* Mock image preview if exists, or placeholder */}
          {note.image_url ? (
            <img 
              src={note.image_url} 
              alt={note.title} 
              className="object-cover w-full h-full opacity-60 mix-blend-multiply"
            />
          ) : (
             <div className="text-clarity-muted text-xs opacity-50 uppercase tracking-widest px-4 text-center">
               Aperçu de la Note
             </div>
          )}
        </div>
      </div>

      {/* Note Details */}
      <div className="p-6">
        <h3 className="font-bold text-lg text-clarity-darkBrown truncate mb-1">
          {note.title}
        </h3>
        <div className="flex justify-between items-center text-sm font-medium">
          <span className="text-clarity-muted">
            {new Date(note.created_at).toLocaleDateString('fr-FR')}
          </span>
          <span className="text-clarity-muted">
            {/* Mocking page count as per design */}
            {(Math.abs(note.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0)) % 5) + 1} pages
          </span>
        </div>
      </div>
    </div>
  );
};
