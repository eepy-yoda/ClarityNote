import React, { useState, useEffect } from 'react';
import { ApiService } from '../services/api_service';
import type { AppEvent } from '../models/types';
import { 
  Calendar, 
  Users, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Lock, 
  MapPin, 
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../viewmodels/useAuth';

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'events' | 'users'>('events');
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [users, setUsers] = useState<{ name: string; email: string }[]>([]);

  // Modals state
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<AppEvent | null>(null);
  const [showDeleteEventConfirm, setShowDeleteEventConfirm] = useState<string | null>(null);
  const [showDeleteUserConfirm, setShowDeleteUserConfirm] = useState<string | null>(null);

  // Form state
  const [eventTitle, setEventTitle] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventPlace, setEventPlace] = useState('');

  // Load data from localStorage or fallback
  useEffect(() => {
    // 1. Events loading
    const storedEvents = localStorage.getItem('clarity_events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    } else {
      ApiService.getEvents()
        .then((evtList) => {
          const formatted = evtList.map((e) => ({
            ...e,
            place: e.place || 'Amphi A, Campus Centre',
          }));
          localStorage.setItem('clarity_events', JSON.stringify(formatted));
          setEvents(formatted);
        })
        .catch(console.error);
    }

    // 2. Users loading
    const storedUsers = localStorage.getItem('clarity_users');
    let loadedUsers = [];
    if (storedUsers) {
      loadedUsers = JSON.parse(storedUsers);
    } else {
      loadedUsers = [
        { name: 'Jane Doe', email: 'jane@example.com' },
        { name: 'John Smith', email: 'john@example.com' },
        { name: 'Admin User', email: 'tsmeowtsmeow@gmail.com' },
        { name: 'Nour Admin', email: 'nourromdhane21@gmail.com' },
      ];
      localStorage.setItem('clarity_users', JSON.stringify(loadedUsers));
    }
    setUsers(loadedUsers);
  }, []);

  // Update current user registration when admin visits if needed
  useEffect(() => {
    if (user) {
      const storedUsers = localStorage.getItem('clarity_users');
      const usersList = storedUsers ? JSON.parse(storedUsers) : [];
      const userExists = usersList.some(
        (u: any) => u.email.toLowerCase() === user.email.toLowerCase()
      );
      if (!userExists) {
        const updated = [
          ...usersList,
          {
            name: user.email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
            email: user.email,
          },
        ];
        localStorage.setItem('clarity_users', JSON.stringify(updated));
        setUsers(updated);
      }
    }
  }, [user]);

  // Open modal for adding
  const openAddModal = () => {
    setEditingEvent(null);
    setEventTitle('');
    setEventDescription('');
    // Formats date to 'YYYY-MM-DDThh:mm' local timezone
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setEventDate(now.toISOString().slice(0, 16));
    setEventPlace('');
    setShowEventModal(true);
  };

  // Open modal for editing
  const openEditModal = (evt: AppEvent) => {
    setEditingEvent(evt);
    setEventTitle(evt.title);
    setEventDescription(evt.description);
    // Formats event date to match datetime-local input format
    const d = new Date(evt.event_date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    setEventDate(d.toISOString().slice(0, 16));
    setEventPlace(evt.place || '');
    setShowEventModal(true);
  };

  // Save Event (Add or Edit)
  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim() || !eventDate) return;

    let updatedEvents: AppEvent[] = [];

    if (editingEvent) {
      // Edit mode
      updatedEvents = events.map((evt) =>
        evt.id === editingEvent.id
          ? {
              ...evt,
              title: eventTitle.trim(),
              description: eventDescription.trim(),
              event_date: new Date(eventDate).toISOString(),
              place: eventPlace.trim(),
            }
          : evt
      );
    } else {
      // Add mode
      const newEvent: AppEvent = {
        id: `event-${Date.now()}`,
        title: eventTitle.trim(),
        description: eventDescription.trim(),
        event_date: new Date(eventDate).toISOString(),
        place: eventPlace.trim(),
        created_at: new Date().toISOString(),
      };
      updatedEvents = [newEvent, ...events];
    }

    localStorage.setItem('clarity_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    setShowEventModal(false);
    setEditingEvent(null);
  };

  // Delete Event
  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter((evt) => evt.id !== id);
    localStorage.setItem('clarity_events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    setShowDeleteEventConfirm(null);
  };

  // Delete User
  const handleDeleteUser = (email: string) => {
    // Admin cannot delete their own account
    if (email.toLowerCase() === user?.email?.toLowerCase()) return;

    const updatedUsers = users.filter((u) => u.email.toLowerCase() !== email.toLowerCase());
    localStorage.setItem('clarity_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowDeleteUserConfirm(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-4">
      {/* Header */}
      <div>
        <h1 className="text-5xl font-extrabold text-clarity-darkBrown font-serif pb-2 leading-tight">
          Admin Panel
        </h1>
        <p className="text-clarity-muted text-lg font-medium">
          Gérez les événements de la plateforme et suivez les utilisateurs inscrits.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-clarity-beige gap-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 pb-4 text-lg font-bold border-b-2 transition-all ${
            activeTab === 'events'
              ? 'border-clarity-brown text-clarity-brown'
              : 'border-transparent text-clarity-muted hover:text-clarity-darkBrown'
          }`}
        >
          <Calendar className="w-5 h-5" />
          Événements ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 pb-4 text-lg font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-clarity-brown text-clarity-brown'
              : 'border-transparent text-clarity-muted hover:text-clarity-darkBrown'
          }`}
        >
          <Users className="w-5 h-5" />
          Utilisateurs ({users.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'events' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-clarity-darkBrown">Liste des Événements</h2>
            <button
              onClick={openAddModal}
              className="bg-clarity-brown text-white px-5 py-2.5 rounded-2xl font-bold shadow-md hover:bg-clarity-darkBrown transition-all flex items-center gap-2 active:scale-95 text-sm"
            >
              <Plus className="w-4 h-4" /> Ajouter un Événement
            </button>
          </div>

          <div className="bg-clarity-card rounded-[2.5rem] border border-clarity-beige/40 shadow-soft overflow-hidden">
            {events.length === 0 ? (
              <div className="text-center py-20 bg-white">
                <Calendar className="w-12 h-12 text-clarity-muted opacity-25 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-clarity-darkBrown mb-1">Aucun événement</h3>
                <p className="text-clarity-muted text-sm font-medium">
                  Cliquez sur le bouton ci-dessus pour en créer un nouveau.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-clarity-beige/30">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-clarity-bg/20 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="bg-clarity-beige/40 p-4 rounded-2xl text-clarity-brown flex flex-col items-center justify-center min-w-[80px]">
                        <Calendar className="w-6 h-6 mb-1" />
                        <span className="text-xs font-extrabold uppercase tracking-wider">
                          {new Date(evt.event_date).toLocaleDateString('fr-FR', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-bold text-clarity-darkBrown">{evt.title}</h3>
                        <p className="text-clarity-muted text-sm font-medium line-clamp-2 max-w-2xl">
                          {evt.description || "Pas de description."}
                        </p>
                        {evt.place && (
                          <div className="flex items-center gap-1.5 text-xs text-clarity-muted font-bold">
                            <MapPin className="w-3.5 h-3.5 text-clarity-brown" />
                            <span>{evt.place}</span>
                          </div>
                        )}
                        <span className="text-[10px] text-clarity-muted/50 block font-medium">
                          Date: {new Date(evt.event_date).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end md:self-center">
                      <button
                        onClick={() => openEditModal(evt)}
                        className="p-2.5 rounded-xl border border-clarity-beige text-clarity-brown hover:bg-clarity-beige/30 transition-all active:scale-95"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowDeleteEventConfirm(evt.id)}
                        className="p-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-all active:scale-95"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-clarity-darkBrown">Utilisateurs Enregistrés</h2>
          </div>

          <div className="bg-clarity-card rounded-[2.5rem] border border-clarity-beige/40 shadow-soft overflow-hidden">
            <div className="divide-y divide-clarity-beige/30">
              {users.map((u) => {
                const isSelf = u.email.toLowerCase() === user?.email?.toLowerCase();
                return (
                  <div
                    key={u.email}
                    className="p-6 flex items-center justify-between gap-4 hover:bg-clarity-bg/20 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-clarity-brown/10 p-3 rounded-2xl text-clarity-brown">
                        {isSelf ? <UserCheck className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-clarity-darkBrown text-lg">{u.name}</span>
                          {isSelf && (
                            <span className="bg-clarity-beige text-clarity-brown text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                              Vous (Admin)
                            </span>
                          )}
                        </div>
                        <span className="text-clarity-muted text-sm font-medium">{u.email}</span>
                      </div>
                    </div>

                    <div>
                      {isSelf ? (
                        <div className="flex items-center gap-1.5 text-xs text-clarity-muted bg-clarity-bg px-3 py-1.5 rounded-xl border border-clarity-beige">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Suppression verrouillée</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowDeleteUserConfirm(u.email)}
                          className="p-2.5 rounded-xl border border-red-100 text-red-600 hover:bg-red-50 transition-all active:scale-95"
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 shadow-2xl relative border border-clarity-beige/50">
            <button
              onClick={() => setShowEventModal(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-clarity-darkBrown transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-clarity-darkBrown mb-6">
              {editingEvent ? "Modifier l'événement" : "Créer un événement"}
            </h2>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-clarity-darkBrown mb-1">
                  Nom de l'événement *
                </label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-clarity-beige focus:outline-none focus:ring-2 focus:ring-clarity-brown bg-clarity-paper transition-all font-medium text-clarity-darkBrown text-sm"
                  placeholder="Ex: Séance de révision Algèbre"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-clarity-darkBrown mb-1">
                    Date et heure *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-clarity-beige focus:outline-none focus:ring-2 focus:ring-clarity-brown bg-clarity-paper transition-all font-medium text-clarity-darkBrown text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-clarity-darkBrown mb-1">Lieu</label>
                  <input
                    type="text"
                    value={eventPlace}
                    onChange={(e) => setEventPlace(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-clarity-beige focus:outline-none focus:ring-2 focus:ring-clarity-brown bg-clarity-paper transition-all font-medium text-clarity-darkBrown text-sm"
                    placeholder="Ex: Bibliothèque Salle 2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-clarity-darkBrown mb-1">
                  Description / Détails
                </label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-clarity-beige focus:outline-none focus:ring-2 focus:ring-clarity-brown bg-clarity-paper transition-all font-medium text-clarity-darkBrown text-sm resize-none"
                  placeholder="Ajoutez des détails sur cet événement..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-clarity-beige/50">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-clarity-beige text-clarity-brown hover:bg-clarity-beige/30 transition-all text-sm font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-clarity-brown text-white hover:bg-clarity-darkBrown transition-all text-sm font-bold"
                >
                  {editingEvent ? "Sauvegarder" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Event Confirmation Modal */}
      {showDeleteEventConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-clarity-beige/50 text-center">
            <div className="bg-red-50 text-red-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-clarity-darkBrown mb-2">Supprimer l'événement ?</h3>
            <p className="text-clarity-muted text-sm font-medium mb-6">
              Cette action est irréversible. L'événement sera définitivement retiré.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteEventConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-clarity-beige text-clarity-brown hover:bg-clarity-beige/30 transition-all font-bold text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteEvent(showDeleteEventConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {showDeleteUserConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl border border-clarity-beige/50 text-center">
            <div className="bg-red-50 text-red-600 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-clarity-darkBrown mb-2">Supprimer l'utilisateur ?</h3>
            <p className="text-clarity-muted text-sm font-medium mb-6">
              Voulez-vous vraiment retirer l'accès de <strong>{showDeleteUserConfirm}</strong> ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteUserConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-clarity-beige text-clarity-brown hover:bg-clarity-beige/30 transition-all font-bold text-sm"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDeleteUser(showDeleteUserConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all font-bold text-sm"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
