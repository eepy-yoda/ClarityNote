import React, { useEffect, useState } from 'react';
import { ApiService } from '../services/api_service';
import type { AppEvent } from '../models/types';
import { Calendar, MapPin } from 'lucide-react';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<AppEvent[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('clarity_events');
    if (stored) {
      setEvents(JSON.parse(stored));
    } else {
      ApiService.getEvents()
        .then((evtList) => {
          const withPlace = evtList.map((e) => ({
            ...e,
            place: e.place || 'Amphi A, Campus Centre',
          }));
          localStorage.setItem('clarity_events', JSON.stringify(withPlace));
          setEvents(withPlace);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-4 leading-tight">Événements à venir</h1>
        <p className="text-clarity-muted text-lg font-medium">Restez informé des sessions d'étude et des examens.</p>
      </div>
      
      <div className="grid gap-8">
        {events.map((evt) => (
          <div key={evt.id} className="bg-clarity-card p-8 rounded-[2.5rem] shadow-soft border border-clarity-beige hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row gap-8 items-center group">
            <div className="bg-clarity-beige/30 p-8 rounded-[2rem] text-clarity-brown flex flex-col items-center justify-center min-w-[120px] transition-transform group-hover:scale-105">
              <Calendar className="w-10 h-10 mb-2" />
              <span className="text-sm font-extrabold uppercase tracking-widest">{new Date(evt.event_date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}</span>
            </div>
            <div className="flex-1 space-y-3">
              <h3 className="text-3xl font-bold text-clarity-darkBrown transition-colors group-hover:text-clarity-brown">{evt.title}</h3>
              <p className="text-clarity-muted text-lg font-medium leading-relaxed">{evt.description}</p>
              {evt.place && (
                <p className="text-clarity-muted/80 text-sm font-semibold flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-clarity-brown" />
                  <span>{evt.place}</span>
                </p>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-center py-32 bg-clarity-card rounded-[3rem] border-2 border-dashed border-clarity-beige/50">
            <div className="bg-clarity-beige/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
               <Calendar className="w-10 h-10 text-clarity-muted opacity-30" />
            </div>
            <p className="text-clarity-muted text-xl font-medium">Aucun événement trouvé pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};
